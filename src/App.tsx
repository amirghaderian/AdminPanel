import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Home,
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  User,
  Activity,
  Plus,
  Sun,
  Moon,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./components";
// Theme Context
type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  // Default implementation that will be replaced by actual implementation
  setTheme: (_theme: Theme) => {
    console.log("Theme provider not initialized");
  },
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference in localStorage
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      return savedTheme || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative overflow-hidden"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-all" />
        ) : (
          <Moon className="h-5 w-5 transition-all" />
        )}
      </Button>
    </div>
  );
}

// Layout Components
function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle responsive sidebar
  const isMobile = () => window.innerWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="bg-background border-b border-border h-16 fixed top-0 right-0 left-0 z-30">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link
              to="/"
              className="text-xl font-bold text-primary hidden md:block"
            >
              پنل مدیریتی
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="جستجو..."
                className="w-full pl-8 bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://admindash-tj3nu2jz.on.adaptive.ai/cdn/ccjWZpG7chtkCEnYaYwTdiXpE8EmwbjF.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">Admin User</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="pt-16 flex flex-1">
        <div
          initial={{ x: isMobile() ? -240 : 0 }}
          animate={{ x: sidebarOpen ? 0 : -240 }}
          transition={{ duration: 0.3 }}
          className="w-60 bg-card border-r border-border fixed left-0 bottom-0 top-16 z-20 overflow-y-auto"
        >
          <div className="p-4">
            {isMobile() && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            <nav className="space-y-1 mt-4">
              <Link to="/">
                <Button variant="secondary" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  داشبورد
                </Button>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 pt-8 ${
            sidebarOpen ? "md:ml-60" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// Dashboard Page with static data
function DashboardPage() {
  // Hardcoded dashboard data
  const dashboardData = {
    metrics: {
      totalUsers: 6,
      activeUsers: 5,
      adminUsers: 1,
      pendingTasks: 0,
    },
    weeklyActivity: [
      { date: "2025-04-22", value: 65 },
      { date: "2025-04-23", value: 45 },
      { date: "2025-04-24", value: 75 },
      { date: "2025-04-25", value: 55 },
      { date: "2025-04-26", value: 25 },
      { date: "2025-04-27", value: 30 },
      { date: "2025-04-28", value: 80 },
    ],
    recentActivities: [
      {
        id: "1",
        userId: "system",
        action: "login",
        description: "ورود کاربر مدیر",
        createdAt: "2025-04-28T10:30:00Z",
      },
      {
        id: "2",
        userId: "system",
        action: "create",
        description: "ایجاد حساب کاربری جدید",
        createdAt: "2025-04-27T14:45:00Z",
      },
      {
        id: "3",
        userId: "system",
        action: "update",
        description: "به‌روزرسانی تنظیمات سیستم",
        createdAt: "2025-04-26T09:15:00Z",
      },
      {
        id: "4",
        userId: "system",
        action: "delete",
        description: "حذف حساب کاربری",
        createdAt: "2025-04-25T16:20:00Z",
      },
      {
        id: "5",
        userId: "system",
        action: "export",
        description: "صادرات داده‌ها به فایل CSV",
        createdAt: "2025-04-24T11:10:00Z",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">داشبورد</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          گزارش جدید
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کل کاربران
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کاربران فعال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کاربران ادمین
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.adminUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-muted-foreground">No change</span> from last
              month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تسک های در حال انتظار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500">+2</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت در طول هفته </CardTitle>
          <CardDescription>User activity over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {/* Simple chart visualization */}
            <div className="flex items-end justify-between h-[160px] w-full">
              {dashboardData?.weeklyActivity.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="bg-primary rounded-t w-12 transition-all duration-500"
                    style={{ height: `${day.value}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">
                    {day.date
                      ? new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت اخیر</CardTitle>
          <CardDescription>آخرین وضعیت ها در سیستم</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-muted rounded-full p-2">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            نمایش تمام فعالیت ها
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}
