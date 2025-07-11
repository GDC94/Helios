import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  ImageIcon,
  Code,
  Settings,
  Database,
  Container,
} from "lucide-react";

interface FileSystemItem {
  id: string;
  name: string;
  type: "folder" | "file";
  extension?: string;
  children?: FileSystemItem[];
}

const backendStructure: FileSystemItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "routes",
        type: "folder",
        children: [
          { id: "3", name: "metrics.ts", type: "file", extension: "ts" },
        ],
      },
      {
        id: "4",
        name: "services",
        type: "folder",
        children: [
          { id: "5", name: "chartService.ts", type: "file", extension: "ts" },
          { id: "6", name: "snapshotJob.ts", type: "file", extension: "ts" },
          { id: "7", name: "index.ts", type: "file", extension: "ts" },
        ],
      },
      {
        id: "8",
        name: "graphql",
        type: "folder",
        children: [
          { id: "9", name: "client.ts", type: "file", extension: "ts" },
        ],
      },
      {
        id: "9",
        name: "db",
        type: "folder",
        children: [
          { id: "10", name: "healthcheck.ts", type: "file", extension: "ts" },
        ],
      },
      {
        id: "11",
        name: "types",
        type: "folder",
        children: [
          { id: "11", name: "chart.ts", type: "file", extension: "ts" },
        ],
      },
      { id: "12", name: "index.ts", type: "file", extension: "ts" },
    ],
  },
  { id: "13", name: "node_modules", type: "folder" },
  {
    id: "13`",
    name: "prisma",
    type: "folder",
    children: [
      { id: "14", name: "schema.prisma", type: "file", extension: "prisma" },
    ],
  },
  { id: "15", name: "package.json", type: "file", extension: "json" },
  { id: "16", name: "Dockerfile", type: "file", extension: "docker" },
  { id: "17", name: "docker-compose.yml", type: "file", extension: "yml" },
];

const frontendStructure: FileSystemItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          {
            id: "3",
            name: "commons",
            type: "folder",
            children: [
              {
                id: "4",
                name: "Header",
                type: "folder",
                children: [
                  {
                    id: "5",
                    name: "Header.tsx",
                    type: "file",
                    extension: "tsx",
                  },
                  {
                    id: "6",
                    name: "index.tsx",
                    type: "file",
                    extension: "tsx",
                  },
                ],
              },
              {
                id: "7",
                name: "Footer",
                type: "folder",
                children: [
                  {
                    id: "8",
                    name: "Footer.tsx",
                    type: "file",
                    extension: "tsx",
                  },
                  {
                    id: "9",
                    name: "index.tsx",
                    type: "file",
                    extension: "tsx",
                  },
                ],
              },
            ],
          },
          {
            id: "10",
            name: "Dashboard",
            type: "folder",
            children: [
              {
                id: "11",
                name: "PerformanceChart",
                type: "folder",
                children: [
                  {
                    id: "12",
                    name: "PerformanceChart.tsx",
                    type: "file",
                    extension: "tsx",
                  },
                  {
                    id: "13",
                    name: "components",
                    type: "folder",
                    children: [
                      { id: "14", name: "ChartSkeleton/", type: "folder" },
                      { id: "15", name: "TechStackMarquee/", type: "folder" },
                    ],
                  },
                  {
                    id: "16",
                    name: "helpers",
                    type: "folder",
                    children: [
                      {
                        id: "17",
                        name: "axisConfigs.ts",
                        type: "file",
                        extension: "ts",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "18",
            name: "ui",
            type: "folder",
            children: [
              { id: "20", name: "button.tsx", type: "file", extension: "tsx" },
            ],
          },
        ],
      },
      {
        id: "18",
        name: "pages",
        type: "folder",
        children: [
          { id: "19", name: "Home.tsx", type: "file", extension: "tsx" },
          { id: "20", name: "Dashboard.tsx", type: "file", extension: "tsx" },
          { id: "21", name: "index.tsx", type: "file", extension: "tsx" },
        ],
      },
      {
        id: "22",
        name: "hooks",
        type: "folder",
        children: [
          {
            id: "23",
            name: "useGetChartData.ts",
            type: "file",
            extension: "ts",
          },
        ],
      },
      {
        id: "24",
        name: "lib",
        type: "folder",
        children: [
          { id: "25", name: "utils.ts", type: "file", extension: "ts" },
        ],
      },
      {
        id: "26",
        name: "layouts",
        type: "folder",
        children: [
          {
            id: "27",
            name: "DashboardLayout.tsx",
            type: "file",
            extension: "tsx",
          },
        ],
      },
      {
        id: "27",
        name: "utils",
        type: "folder",
      },
      {
        id: "28",
        name: "test",
        type: "folder",
      },
    ],
  },
  { id: "26", name: "package.json", type: "file", extension: "json" },
  { id: "27", name: "vite.config.ts", type: "file", extension: "ts" },
  { id: "28", name: "tsconfig.json", type: "file", extension: "json" },
  { id: "29", name: "tsconfig.node.json", type: "file", extension: "json" },
  { id: "30", name: "tsconfig.app.json", type: "file", extension: "json" },
  { id: "31", name: "tsconfig.node.json", type: "file", extension: "json" },
  { id: "32", name: "tsconfig.app.json", type: "file", extension: "json" },
  { id: "34", name: "App.test.tsx", type: "file", extension: "tsx" },
  { id: "35", name: "App.test.tsx", type: "file", extension: "tsx" },
  { id: "34", name: "main.tsx", type: "file", extension: "tsx" },
];

const fileIconMap = {
  tsx: <Code className="w-4 h-4 text-blue-500" />,
  ts: <Code className="w-4 h-4 text-blue-500" />,
  js: <Code className="w-4 h-4 text-blue-500" />,
  jsx: <Code className="w-4 h-4 text-blue-500" />,
  css: <FileText className="w-4 h-4 text-purple-500" />,
  scss: <FileText className="w-4 h-4 text-purple-500" />,
  sass: <FileText className="w-4 h-4 text-purple-500" />,
  json: <Settings className="w-4 h-4 text-yellow-500" />,
  md: <FileText className="w-4 h-4 text-gray-600" />,
  txt: <FileText className="w-4 h-4 text-gray-600" />,
  png: <ImageIcon className="w-4 h-4 text-green-500" />,
  jpg: <ImageIcon className="w-4 h-4 text-green-500" />,
  jpeg: <ImageIcon className="w-4 h-4 text-green-500" />,
  gif: <ImageIcon className="w-4 h-4 text-green-500" />,
  svg: <ImageIcon className="w-4 h-4 text-green-500" />,
  ico: <ImageIcon className="w-4 h-4 text-green-500" />,
  webp: <ImageIcon className="w-4 h-4 text-green-500" />,
  prisma: <Database className="w-4 h-4 text-indigo-500" />,
  docker: <Container className="w-4 h-4 text-blue-600" />,
  yml: <Settings className="w-4 h-4 text-orange-500" />,
  yaml: <Settings className="w-4 h-4 text-orange-500" />,
  default: <File className="w-4 h-4 text-gray-500" />,
};

const getFileIcon = (extension?: string) => {
  if (!extension) return fileIconMap.default;
  return (
    fileIconMap[extension as keyof typeof fileIconMap] || fileIconMap.default
  );
};

interface FileSystemNodeProps {
  item: FileSystemItem;
  level: number;
}

const FileSystemNode = ({ item, level }: FileSystemNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const toggleExpanded = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-150 ${
          item.type === "folder" ? "font-medium" : ""
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={toggleExpanded}
      >
        {item.type === "folder" && (
          <div className="mr-1">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </div>
        )}

        <div className="mr-2">
          {item.type === "folder" ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-600" />
            ) : (
              <Folder className="w-4 h-4 text-blue-600" />
            )
          ) : (
            getFileIcon(item.extension)
          )}
        </div>

        <span
          className={`text-sm ${item.type === "folder" ? "text-gray-800" : "text-gray-600"}`}
        >
          {item.name}
        </span>
      </div>

      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map(child => (
            <FileSystemNode key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FolderStructureProps {
  type?: "backend" | "frontend";
}

const FolderStructure = ({ type = "frontend" }: FolderStructureProps) => {
  const structure = type === "backend" ? backendStructure : frontendStructure;
  const title = type === "backend" ? "Backend structure" : "Frontend structure";

  return (
    <div className="font-mono text-sm w-full mx-auto">
      <div className="border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-sans">
          {title}
        </h3>
        <div className="bg-white rounded border">
          {structure.map(item => (
            <FileSystemNode key={item.id} item={item} level={0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderStructure;
