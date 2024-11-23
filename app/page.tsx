"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { useS3Upload } from "next-s3-upload";
import { PhotoIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { MenuGrid } from "@/components/menu-grid";
import Image from "next/image";
import { MenuTable } from "@/components/menu-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useAIProvider } from "@/contexts/ai-provider-context";
import { convertToCSV, downloadCSV } from "@/lib/utils";
import { ApiKeyWarningModal } from "@/components/api-key-warning-modal";

export interface MenuItem {
  id: string;
  codigo: string;
  name: string;
  category: string;
  price: string;
  description: string;
  menuImage?: {
    b64_json: string;
  };
}

export default function Home() {
  const { uploadToS3 } = useS3Upload();
  const [menuUrl, setMenuUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created" | "error"
  >("initial");
  const [parsedMenu, setParsedMenu] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { provider, analysisType, storageProvider, globalApiKey } =
    useAIProvider();
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [lastRequestItems, setLastRequestItems] = useState<number>(0);
  const [isApiKeyWarningOpen, setIsApiKeyWarningOpen] = useState(false);

  const resetUpload = () => {
    setMenuUrl(undefined);
    setStatus("initial");
  };

  const handleFileChange = async (file: File) => {
    if (!globalApiKey) {
      setIsApiKeyWarningOpen(true);
      return;
    }

    setCurrentFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMenuUrl(objectUrl);
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("apiKey", globalApiKey);

      const uploadEndpoint =
        storageProvider === "minio"
          ? "/api/s3-upload-minio"
          : "/api/s3-upload-aws";

      let storageUrl = "";
      if (storageProvider === "minio") {
        const uploadResponse = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();

        if (!uploadData.url) {
          throw new Error("URL not returned by the server");
        }

        setMenuUrl(uploadData.url);
        storageUrl = uploadData.url;
        setStatus("parsing");
      } else {
        const { url } = await uploadToS3(file);
        setMenuUrl(url);
        setStatus("parsing");
        storageUrl = url;
      }

      const endpoint =
        provider === "groq" ? "/api/groq-parse" : "/api/openai-parse";
      const parseResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: storageUrl,
          analysisType,
          apiKey: globalApiKey,
        }),
      });

      if (!parseResponse.ok) {
        setStatus("error");
        throw new Error(`Failed to process menu: ${parseResponse.statusText}`);
      }

      const parseData = await parseResponse.json();

      try {
        const menuItems = JSON.parse(parseData.choices[0].message.content);
        const menuItemsWithImage = menuItems.map(
          (item: Omit<MenuItem, "id">) => ({
            id: crypto.randomUUID(),
            ...item,
            menuImage: {
              b64_json: "/images/placeholder.jpg",
            },
          })
        );
        setLastRequestItems(menuItems.length);
        setParsedMenu((prevItems) => [...prevItems, ...menuItemsWithImage]);
        toast.success("Menu processed successfully!");
        setStatus("created");
      } catch (e) {
        console.error("Error processing items:", e);
        toast.error("Error processing items. Please try again.");
        setStatus("error");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Detailed error:", err);
      toast.error(`Error: ${err.message || "Unknown error"}`);
      setStatus("error");
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  const filteredMenu = parsedMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setParsedMenu(
      parsedMenu.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const handleProcessData = () => {
    if (!globalApiKey) {
      setIsApiKeyWarningOpen(true);
      return;
    }

    try {
      const dataToSend = {
        totalItems: parsedMenu.length,
        lastModified: new Date().toISOString(),
        items: parsedMenu.map((item) => ({
          name: item.name,
          price: item.price,
          description: item.description,
          codigo: item.codigo,
          category: item.category,
        })),
      };

      console.log("Data that would be sent:", dataToSend);

      // Gera e faz download do CSV
      const csv = convertToCSV(dataToSend.items);
      const filename = `menu_items_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csv, filename);

      toast.success("Data processed and CSV generated successfully!");
    } catch (error) {
      toast.error("Error processing data");
      console.error("Error processing data:", error);
    }
  };

  const handleDeleteItem = (id: string) => {
    setParsedMenu((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item successfully deleted!");
  };

  return (
    <div className="container text-center px-4 py-8 bg-background text-foreground max-w-5xl mx-auto">
      <Toaster position="top-right" richColors />

      <ApiKeyWarningModal
        isOpen={isApiKeyWarningOpen}
        onClose={() => setIsApiKeyWarningOpen(false)}
      />

      <div className="max-w-4xl text-center mx-auto sm:mt-4 mt-2">
        <h1 className="mb-6 text-balance text-6xl font-bold text-foreground">
          Scan menus and individual items with AI
        </h1>
      </div>
      <div className="max-w-6xl text-center mx-auto">
        <p className="mb-8 text-lg text-muted-foreground text-balance">
          Take a picture of a menu or item and extract detailed data to
          streamline your cataloging process.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {status === "initial" && (
          <>
            <Dropzone
              accept={{
                "image/*": [".jpg", ".jpeg", ".png"],
              }}
              multiple={false}
              onDrop={(acceptedFiles) => handleFileChange(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps, isDragAccept }) => (
                <div
                  className={`mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-background ${
                    isDragAccept ? "border-primary" : "border-border"
                  }`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                      <label
                        htmlFor="file-upload"
                        className="relative rounded-md bg-background font-semibold text-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary"
                      >
                        <p className="text-xl">Upload your menu or item tag</p>
                        <p className="mt-1 font-normal text-muted-foreground">
                          or take a picture
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>
          </>
        )}

        {menuUrl && status !== "initial" && (
          <div className="my-10 mx-auto flex flex-col items-center">
            <Image
              width={1024}
              height={768}
              src={menuUrl}
              alt="Menu"
              className="w-40 rounded-lg shadow-md"
            />
            {(status === "created" || status === "error") && (
              <div className="flex gap-2 mt-4">
                {status === "error" && currentFile && (
                  <Button
                    onClick={() => {
                      setStatus("parsing");
                      handleFileChange(currentFile);
                    }}
                    variant="secondary"
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  style={{ width: "150px" }}
                >
                  Process new image
                </Button>
              </div>
            )}
          </div>
        )}

        {status === "uploading" && (
          <div className="mt-10 flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
              <p className="text-lg text-gray-600">Image processing...</p>
            </div>
          </div>
        )}

        {status === "parsing" && (
          <div className="mt-10 flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
              <p className="text-lg text-gray-600">
                Extracting data from your image...
              </p>
            </div>
            {parsedMenu.length === 0 && (
              <div className="w-full max-w-2xl space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {parsedMenu.length > 0 && (
        <>
          <div className="mt-10">
            <div className="flex gap-2">
              {status === "created" && (
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  style={{ width: "150px" }}
                >
                  New Image
                </Button>
              )}
              <Button
                onClick={handleProcessData}
                className="flex items-center gap-2"
                style={{ width: "150px" }}
              >
                <SaveIcon className="w-4 h-4" />
                Process Data
              </Button>
              <span className="text-muted-foreground mt-2 ml-2">
                Generate csv file
              </span>
            </div>
          </div>
          <div className="mt-10">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-4xl font-bold flex items-center gap-3">
                  <span>{lastRequestItems} items detected</span>
                  <span className="text-muted-foreground text-xl">•</span>
                  <span className="text-muted-foreground text-xl">
                    {parsedMenu.length} total items
                  </span>
                </h2>
                {status === "created" && (
                  <p className="text-sm text-gray-500 mt-1">
                    You can add more items by processing a new image
                  </p>
                )}
              </div>
            </div>

            {/* <h3 className="text-3xl font-bold flex items-center gap-3 mb-4">
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{parsedMenu.length} total items</span>
          </h3> */}

            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mx-auto mb-4">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="grid">
                <MenuGrid
                  items={filteredMenu}
                  onDeleteItem={handleDeleteItem}
                />
              </TabsContent>
              <TabsContent value="table">
                <MenuTable
                  items={filteredMenu}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
