"use client";

import { useState, useEffect } from "react";
import { Search, Crosshair, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type ScrapedRow = {
    [key: string]: string | number | boolean | object;
};

type SelectedElement = {
    xpath: string;
    text: string;
};

type LoadingState = {
    scraping: boolean;
    reddit: boolean;
};

export default function Home() {
    const [url, setUrl] = useState<string>("");
    const [maxPages, setMaxPages] = useState<number>(1);
    const [scrapedData, setScrapedData] = useState<ScrapedRow[]>([]);
    const [selectedData, setSelectedData] = useState<SelectedElement[]>([]);
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<LoadingState>({
        scraping: false,
        reddit: false,
    });
    const [response, setResponse] = useState<string>("");

    useEffect(() => {
        const storedData = localStorage.getItem("scrapedData");
        const storedElements = localStorage.getItem("selectedElements");
        const storedSelectedData = localStorage.getItem("selectedData");
        const storedUrl = localStorage.getItem("scrapeUrl");

        if (storedData) setScrapedData(JSON.parse(storedData));
        if (storedElements) setSelectedElements(JSON.parse(storedElements));
        if (storedSelectedData) setSelectedData(JSON.parse(storedSelectedData));
        if (storedUrl) setUrl(storedUrl);
    }, []);

    const exportToCSV = (data: object[], filename: string) => {
        if (data.length === 0) return;

        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(","));

        for (const row of data) {
            const values = headers.map((header) => {
                const val = (row as any)[header];
                return typeof val === "object" ? JSON.stringify(val) : `"${val}"`;
            });
            csvRows.push(values.join(","));
        }

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };


    const fetchSelectedElements = async () => {
        try {
            const res = await fetch("http://localhost:8000/get-xpaths", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to fetch XPaths");

            const data = await res.json();
            console.log("Fetched selected elements:", data);

            if (data.selected_elements && data.selected_elements.length > 0) {
                const cleanedData: SelectedElement[] = data.selected_elements.map(
                    (el: any) => ({ xpath: el.xpath, text: el.text })
                );
                setSelectedElements(cleanedData.map((el) => el.xpath));
                setSelectedData(cleanedData);
                localStorage.setItem(
                    "selectedElements",
                    JSON.stringify(cleanedData.map((el) => el.xpath))
                );
                localStorage.setItem("selectedData", JSON.stringify(cleanedData));
            } else {
                setSelectedElements([]);
                setSelectedData([]);
            }
        } catch (error) {
            console.error("Error fetching selected elements:", error);
            toast.error("Failed to fetch selected elements");
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchSelectedElements, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleStartSelection = async () => {
        if (!url) return;
        setIsSelecting(true);

        try {
            const res = await fetch("http://localhost:8000/select-elements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, max_pages: 1 }),
            });

            if (!res.ok) throw new Error("Failed to start selection");

            const data = await res.json();
            setResponse(data.message || "Selection started successfully");

            await fetchSelectedElements();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to start selection");
        }

        setIsSelecting(false);
    };

    const handleSelection = async (xpath: string) => {
        const response = await fetch("http://localhost:8000/store-xpath", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ xpath }),
        });

        const result = await response.json();
        if (result.data) {
            setSelectedData(result.data);
            localStorage.setItem("selectedData", JSON.stringify(result.data));
        }
    };

    const handleScrape = async () => {
        if (!url) {
            toast.error("Please enter a URL to scrape");
            return;
        }

        setIsLoading((prev) => ({ ...prev, scraping: true }));

        try {
            const response = await fetch("http://localhost:8000/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, max_pages: maxPages }),
            });

            if (!response.ok) throw new Error("Failed to scrape data");

            const data = await response.json();
            setScrapedData(data.data || []);

            localStorage.setItem("scrapedData", JSON.stringify(data.data || []));
            localStorage.setItem("scrapeUrl", url);

            toast.success("Data scraped successfully");
        } catch (error) {
            console.error("Scraping failed:", error);
            toast.error("Failed to scrape data");
        } finally {
            setIsLoading((prev) => ({ ...prev, scraping: false }));
        }
    };

    const handleClearData = async () => {
        try {
            await fetch("http://localhost:8000/clear-xpaths", { method: "POST" });

            localStorage.removeItem("scrapedData");
            localStorage.removeItem("selectedElements");
            localStorage.removeItem("scrapeUrl");

            setScrapedData([]);
            setSelectedElements([]);
            setSelectedData([]);
            setUrl("");

            toast.success("Data cleared successfully");
        } catch (error) {
            console.error("Error clearing data:", error);
            toast.error("Failed to clear data");
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold">DataWeave</h1>
                <p className="text-muted-foreground">
                    Enter a URL | Select elements to scrape | Export data
                </p>

                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter URL to scrape..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                placeholder="Max pages to scrape"
                                value={maxPages}
                                onChange={(e) => setMaxPages(Number(e.target.value))}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleStartSelection}
                                variant="outline"
                                disabled={!url || isSelecting}
                            >
                                <Crosshair className="w-4 h-4 mr-2" />
                                Select Elements
                            </Button>
                        </div>

                        {response && <p className="mt-4">{response}</p>}

                        <div className="flex gap-2">
                            <Button
                                onClick={handleScrape}
                                className="flex-1"
                                disabled={!url || isLoading.scraping}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                {isLoading.scraping ? "Scraping..." : "Start Scraping"}
                            </Button>
                            <Button onClick={handleClearData} variant="destructive">
                                <Trash className="w-4 h-4 mr-2" />
                                Clear Data
                            </Button>
                            <Button
                                onClick={() => {
                                    if (scrapedData.length > 0) {
                                        exportToCSV(scrapedData, "scraped_data");
                                    } else if (selectedData.length > 0) {
                                        exportToCSV(selectedData, "selected_data");
                                    } else {
                                        toast("No data to export");
                                    }
                                }}
                                variant="outline"
                            >
                                Export to CSV
                            </Button>
                        </div>
                    </div>
                </Card>

                <Tabs defaultValue="results-Sc" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="results-Sc">Scraping Results</TabsTrigger>
                        <TabsTrigger value="results-Se">Selected Elements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="results-Sc" className="space-y-4">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold">Scraped Data</h2>
                            {scrapedData.length > 0 ? (
                                <div className="overflow-auto max-h-96">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                {Object.keys(scrapedData[0]).map((key) => (
                                                    <th
                                                        key={key}
                                                        className="border border-gray-300 p-2 text-left"
                                                    >
                                                        {key.toUpperCase()}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scrapedData.map((row, index) => (
                                                <tr key={index} className="odd:bg-gray-100">
                                                    {Object.values(row).map((value, i) => (
                                                        <td
                                                            key={i}
                                                            className="border border-gray-300 p-2"
                                                        >
                                                            {typeof value === "object"
                                                                ? JSON.stringify(value)
                                                                : value?.toString()}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No data scraped yet</p>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="results-Se" className="space-y-4">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold">Selected Data</h2>
                            {selectedData.length > 0 ? (
                                <div className="overflow-auto max-h-96">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-gray-300 p-2 text-left">
                                                    Text
                                                </th>
                                                <th className="border border-gray-300 p-2 text-left">
                                                    XPath
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedData.map((row, index) => (
                                                <tr key={index} className="odd:bg-gray-100">
                                                    <td className="border border-gray-300 p-2">
                                                        {row.text || "No text"}
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        {row.xpath}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No data selected yet</p>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
