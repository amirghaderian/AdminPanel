import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Activity,
  Plus,
  Sun,
  Moon,
  Settings,
  Users,
  FileText,
  BarChart,
  PieChart,
  Calendar,
  Mail,
  MessageSquare,
  ShoppingCart,
  HelpCircle,
  AlertTriangle,
  XCircle,
  Share2,
  CreditCard,
  Smartphone,
  Globe,
  Eye,
  Pencil,
  Trash2,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Alert,
  AlertDescription,
  AlertTitle,
  Switch,
} from "./components";
import { Login } from "./pages";
// Theme Context
type Theme = "light" | "dark" | "system";

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  // Default implementation that will be replaced by actual implementation
  setTheme: (_theme: Theme) => {
    console.log("Theme provider not initialized");
  },
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
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
  const context = React.useContext(ThemeContext);
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

// Tab system types
type TabInfo = {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
};

// Layout Components
function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [openTabs, setOpenTabs] = useState<TabInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Handle responsive sidebar
  const isMobile = () => window.innerWidth < 768;

  React.useEffect(() => {
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

  // Toggle submenu
  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Handle opening a new tab
  const openTab = (tab: TabInfo) => {
    if (!openTabs.some((t) => t.id === tab.id)) {
      setOpenTabs((prev) => [...prev, tab]);
    }
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  // Handle closing a tab
  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((tab) => tab.id !== tabId);
    setOpenTabs(newTabs);

    if (activeTab === tabId && newTabs.length > 0) {
      const lastTab = newTabs[newTabs.length - 1];
      if (lastTab) {
        setActiveTab(lastTab.id);
        navigate(lastTab.path);
      }
    } else if (newTabs.length === 0) {
      setActiveTab(null);
      navigate("/");
    }
  };

  // Set active tab based on current location
  React.useEffect(() => {
    const currentPath = location.pathname;
    const matchingTab = openTabs.find((tab) => tab.path === currentPath);

    if (matchingTab) {
      setActiveTab(matchingTab.id);
    } else if (currentPath !== "/" && currentPath !== "/dashboard") {
      // If we're on a path that should be a tab but isn't open yet
      const pathParts = currentPath.split("/");
      const id =
        pathParts[pathParts.length - 1] ||
        pathParts[pathParts.length - 2] ||
        "page";
      const title = id.charAt(0).toUpperCase() + id.slice(1);

      const newTab: TabInfo = {
        id,
        title,
        path: currentPath,
        icon: <FileText className="h-4 w-4" />,
      };

      openTab(newTab);
    }
  }, [location.pathname]);

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      <header
        dir="rtl"
        className="bg-background border-b border-border fixed top-0 inset-x-0 z-30 flex flex-col"
      >
        {/* Top section */}
        <div className="flex items-center justify-between h-16 px-4">
          {/* Right - logo and menu toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              to="/"
              className="text-xl font-bold text-primary hidden md:block"
            >
              داشبورد ادمین
            </Link>
          </div>

          {/* Center - search box */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="جستجو..."
                className="w-full pr-8 bg-background text-right"
              />
            </div>
          </div>

          {/* Left - theme, notifications, profile */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://admindash-tj3nu2jz.on.adaptive.ai/cdn/ccjWZpG7chtkCEnYaYwTdiXpE8EmwbjF.png" />
                    <AvatarFallback>ادمین</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">کاربر ادمین</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  تنظیمات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tab bar section */}
        {openTabs.length > 0 && (
          <div className="border-t border-border overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="flex h-10">
              {openTabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(tab.path);
                  }}
                  className={`flex items-center px-4 py-2 border-l border-border cursor-pointer min-w-[120px] max-w-[200px] whitespace-nowrap ${
                    activeTab === tab.id ? "bg-secondary" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-shrink-0">{tab.icon}</div>
                    <div className="truncate flex-1 text-right">
                      {tab.title}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 mr-1 opacity-60 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(e, tab.id);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <div className={`pt-${openTabs.length > 0 ? "26" : "16"} flex flex-1`}>
        <div
          className={`w-60 bg-card border-l border-border fixed right-0 bottom-0 ${
            openTabs.length > 0 ? "top-26" : "top-16"
          } z-20 overflow-y-auto`}
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
              {/* داشبورد */}
              <div onClick={() => navigate("/")}>
                <Button
                  variant={location.pathname === "/" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Home className="mr-2 h-4 w-4" />
                  داشبورد
                </Button>
              </div>

              {/* مدیریت کانال‌ها */}
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between group"
                  onClick={() => toggleMenu("channels")}
                >
                  <div className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    مدیریت کانال‌ها
                  </div>
                  {openMenus.includes("channels") ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </Button>
                {openMenus.includes("channels") && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        openTab({
                          id: "atm",
                          title: "دستگاه‌های خودپرداز",
                          path: "/channels/atm",
                          icon: <CreditCard className="h-4 w-4" />,
                        })
                      }
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      دستگاه‌های خودپرداز (ATM)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        openTab({
                          id: "pos",
                          title: "پایانه‌های فروش",
                          path: "/channels/pos",
                          icon: <ShoppingCart className="h-4 w-4" />,
                        })
                      }
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      پایانه‌های فروش (POS)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        openTab({
                          id: "mobilebank",
                          title: "بانکداری موبایلی",
                          path: "/channels/mobilebank",
                          icon: <Smartphone className="h-4 w-4" />,
                        })
                      }
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      بانکداری موبایلی
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        openTab({
                          id: "internetbank",
                          title: "بانکداری اینترنتی",
                          path: "/channels/internetbank",
                          icon: <Globe className="h-4 w-4" />,
                        })
                      }
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      بانکداری اینترنتی
                    </Button>
                  </div>
                )}
              </div>

              {/* گزارش‌ها */}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  openTab({
                    id: "reports",
                    title: "گزارش‌ها",
                    path: "/reports",
                    icon: <BarChart className="h-4 w-4" />,
                  })
                }
              >
                <BarChart className="mr-2 h-4 w-4" />
                گزارش‌ها
              </Button>

              {/* کاربران */}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  openTab({
                    id: "users",
                    title: "کاربران",
                    path: "/users",
                    icon: <Users className="h-4 w-4" />,
                  })
                }
              >
                <Users className="mr-2 h-4 w-4" />
                کاربران
              </Button>

              {/* پیکربندی */}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  openTab({
                    id: "settings",
                    title: "تنظیمات",
                    path: "/settings",
                    icon: <Settings className="h-4 w-4" />,
                  })
                }
              >
                <Settings className="mr-2 h-4 w-4" />
                تنظیمات
              </Button>

              {/* پشتیبانی */}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  openTab({
                    id: "support",
                    title: "پشتیبانی",
                    path: "/support",
                    icon: <HelpCircle className="h-4 w-4" />,
                  })
                }
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                پشتیبانی
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            openTabs.length > 0 ? "pt-28" : "pt-20"
          } ${sidebarOpen ? "md:mr-60" : "mr-0"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// Dashboard Page with static data

function DashboardPage() {
  const dashboardData = {
    metrics: {
      totalChannels: 12,
      activeChannels: 9,
      adminUsers: 3,
      pendingApprovals: 2,
    },
    weeklyActivity: [
      { date: "2025-04-22", value: 70 },
      { date: "2025-04-23", value: 40 },
      { date: "2025-04-24", value: 65 },
      { date: "2025-04-25", value: 50 },
      { date: "2025-04-26", value: 20 },
      { date: "2025-04-27", value: 30 },
      { date: "2025-04-28", value: 90 },
    ],
    recentActivities: [
      {
        id: "1",
        userId: "admin",
        action: "create",
        description: "کانال جدید ایجاد شد",
        createdAt: "2025-04-28T10:30:00Z",
      },
      {
        id: "2",
        userId: "admin",
        action: "update",
        description: "ویرایش اطلاعات کانال",
        createdAt: "2025-04-27T14:45:00Z",
      },
      {
        id: "3",
        userId: "admin",
        action: "approve",
        description: "تأیید درخواست عضویت",
        createdAt: "2025-04-26T09:15:00Z",
      },
      {
        id: "4",
        userId: "admin",
        action: "delete",
        description: "حذف یک کانال",
        createdAt: "2025-04-25T16:20:00Z",
      },
    ],
  };

  return (
    <div dir="ltr" className="space-y-6 text-right">
      <div className="flex flex-row-reverse items-center justify-between">
        <h1 className="text-2xl font-bold">داشبورد مدیریت کانال</h1>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          کانال جدید
        </Button>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تعداد کل کانال‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.totalChannels}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+5٪</span> نسبت به ماه قبل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کانال‌های فعال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.activeChannels}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+3٪</span> نسبت به ماه قبل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تعداد مدیران
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.adminUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">بدون تغییر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              در انتظار تأیید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.metrics.pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500">+2</span> نسبت به دیروز
            </p>
          </CardContent>
        </Card>
      </div>

      {/* نمودار هفتگی */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت هفتگی</CardTitle>
          <CardDescription>
            میزان فعالیت کانال‌ها در ۷ روز گذشته
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <div className="flex flex-row-reverse items-end justify-between h-[160px] w-full">
              {dashboardData?.weeklyActivity.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="bg-primary rounded-t w-12 transition-all duration-500"
                    style={{ height: `${day.value}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">
                    {day.date
                      ? new Date(day.date).toLocaleDateString("fa-IR", {
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

      {/* فعالیت‌های اخیر */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
          <CardDescription>
            آخرین اقدامات انجام‌شده روی کانال‌ها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 flex-row-reverse">
                <div className="bg-muted rounded-full p-2">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            مشاهده همه فعالیت‌ها
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function UsersPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">کاربران</h1>
      <Card>
        <CardHeader>
          <CardTitle>مدیریت کاربران</CardTitle>
          <CardDescription>مشاهده و مدیریت کاربران سیستم</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">نام</TableHead>
                <TableHead className="text-center">ایمیل</TableHead>
                <TableHead className="text-center">نقش</TableHead>
                <TableHead className="text-center">وضعیت</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "علی مرادی",
                  email: "ali@example.com",
                  role: "مدیر",
                  status: "فعال",
                  statusColor: "bg-green-500",
                },
                {
                  name: "زهرا احمدی",
                  email: "zahra@example.com",
                  role: "کاربر",
                  status: "غیرفعال",
                  statusColor: "bg-red-500",
                },
                {
                  name: "مهدی رضایی",
                  email: "mehdi@example.com",
                  role: "کاربر",
                  status: "در انتظار",
                  statusColor: "bg-amber-500",
                },
              ].map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{user.name}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">{user.role}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`${user.statusColor} text-white inline-block`}
                      style={{
                        minWidth: "70px",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center space-x-2 space-x-reverse">
                    <button
                      title="مشاهده"
                      className="text-blue-600 hover:text-blue-800 mx-1"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title="ویرایش"
                      className="text-green-600 hover:text-green-800 mx-1"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      title="حذف"
                      className="text-red-600 hover:text-red-800 mx-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "ادمین‌داش",
    siteUrl: "https://admindash.example.com",
    maintenance: false,
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpSecure: true,
  });

  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("در حال ذخیره تنظیمات:", settings);
    setSaveStatus("success");
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">تنظیمات</h1>
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات سیستم</CardTitle>
          <CardDescription>پیکربندی تنظیمات برنامه</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {saveStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <AlertTitle className="text-green-800 dark:text-green-300">
                  تنظیمات با موفقیت ذخیره شد
                </AlertTitle>
              </div>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">عمومی</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">نام سایت</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteUrl">آدرس سایت</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="maintenance" className="flex-1">
                  حالت تعمیرات
                </Label>
                <Switch
                  id="maintenance"
                  dir="ltr"
                  checked={settings.maintenance}
                  onCheckedChange={(checked) => {
                    setSettings((prev) => ({ ...prev, maintenance: checked }));
                  }}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">ایمیل</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="smtpHost">میزبان SMTP</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtpPort">پورت SMTP</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="smtpSecure" className="flex-1">
                  استفاده از SSL/TLS
                </Label>
                <Switch
                  id="smtpSecure"
                  dir="ltr"
                  checked={settings.smtpSecure}
                  onCheckedChange={(checked) => {
                    setSettings((prev) => ({ ...prev, smtpSecure: checked }));
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>ذخیره تغییرات</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Manage your appointments and events</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Calendar View</h3>
            <p>Calendar content would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Analytics Module</AlertTitle>
        <AlertDescription>
          This is a placeholder for the Analytics module. Select a specific
          analytics page from the sidebar.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function PerformancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Performance Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>
            Metrics and insights about system performance
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Memory Usage</span>
                <span>32%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: "32%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Disk Usage</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatisticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart className="mx-auto h-12 w-12 mb-4" />
              <p>User growth chart would appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PieChart className="mx-auto h-12 w-12 mb-4" />
              <p>Traffic sources chart would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Email</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Dashboard</CardTitle>
          <CardDescription>
            Manage your email campaigns and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Mail className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Email Module</h3>
            <p>Email management interface would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChatPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chat</h1>
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
          <CardDescription>
            Communicate with your team and users
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Chat Interface</h3>
            <p>Chat and messaging interface would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Premium Widget</TableCell>
                <TableCell>Widgets</TableCell>
                <TableCell>$99.99</TableCell>
                <TableCell>45</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Basic Gadget</TableCell>
                <TableCell>Gadgets</TableCell>
                <TableCell>$49.99</TableCell>
                <TableCell>120</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Super Tool</TableCell>
                <TableCell>Tools</TableCell>
                <TableCell>$199.99</TableCell>
                <TableCell>8</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Track and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#ORD-001</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>2025-04-28</TableCell>
                <TableCell>
                  <Badge className="bg-green-500 text-white">Completed</Badge>
                </TableCell>
                <TableCell>$249.99</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#ORD-002</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>2025-04-27</TableCell>
                <TableCell>
                  <Badge className="bg-amber-500">Processing</Badge>
                </TableCell>
                <TableCell>$99.50</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#ORD-003</TableCell>
                <TableCell>Bob Johnson</TableCell>
                <TableCell>2025-04-26</TableCell>
                <TableCell>
                  <Badge variant="destructive">Cancelled</Badge>
                </TableCell>
                <TableCell>$149.75</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Help & Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Getting Started</h3>
            <p className="text-muted-foreground">
              Learn the basics of using the admin dashboard
            </p>
            <Button variant="outline">Read Guide</Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">FAQ</h3>
            <p className="text-muted-foreground">
              Answers to frequently asked questions
            </p>
            <Button variant="outline">View FAQ</Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Contact Support</h3>
            <p className="text-muted-foreground">
              Need more help? Contact our support team
            </p>
            <Button>Contact Support</Button>
          </div>
        </CardContent>
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route
              path="/analytics/performance"
              element={<PerformancePage />}
            />
            <Route path="/analytics/statistics" element={<StatisticsPage />} />
            <Route path="/communication/email" element={<EmailPage />} />
            <Route path="/communication/chat" element={<ChatPage />} />
            <Route path="/ecommerce/products" element={<ProductsPage />} />
            <Route path="/ecommerce/orders" element={<OrdersPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}
