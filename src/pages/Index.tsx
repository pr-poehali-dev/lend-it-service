import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Item = {
  id: number;
  name: string;
  description: string;
  available: boolean;
  owner: string;
};

type Page = "home" | "catalog" | "profile" | "search";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");

  const mockItems: Item[] = [
    { id: 1, name: "Велосипед горный", description: "Отличное состояние, 21 скорость", available: true, owner: "Иван П." },
    { id: 2, name: "Палатка туристическая", description: "4-местная, водонепроницаемая", available: true, owner: "Мария С." },
    { id: 3, name: "Фотоаппарат Canon", description: "Зеркальная камера с объективом", available: false, owner: "Алексей К." },
    { id: 4, name: "Сноуборд", description: "Размер 156см, с креплениями", available: true, owner: "Дмитрий В." },
    { id: 5, name: "Швейная машинка", description: "Электрическая, многофункциональная", available: true, owner: "Ольга М." },
    { id: 6, name: "Дрель ударная", description: "Мощная, с набором сверл", available: true, owner: "Сергей Л." },
  ];

  const filteredItems = mockItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHome = () => (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold tracking-tight">Обмен вещами</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Делитесь вещами с соседями. Экономьте деньги и помогайте планете.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button size="lg" onClick={() => setCurrentPage("catalog")}>
            Посмотреть каталог
          </Button>
          <Button size="lg" variant="outline" onClick={() => setCurrentPage("profile")}>
            Мой профиль
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Популярные вещи</h2>
          <Button variant="ghost" onClick={() => setCurrentPage("catalog")}>
            Все вещи
            <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockItems.slice(0, 3).map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 py-12">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Search" size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold">Найдите нужное</h3>
          <p className="text-sm text-muted-foreground">Используйте поиск по названию или описанию</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="ArrowLeftRight" size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold">Обменяйтесь</h3>
          <p className="text-sm text-muted-foreground">Договоритесь с владельцем о встрече</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Heart" size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold">Помогите природе</h3>
          <p className="text-sm text-muted-foreground">Повторное использование спасает планету</p>
        </div>
      </section>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Каталог вещей</h1>
        <p className="text-muted-foreground">Все доступные вещи для обмена</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      <div className="flex items-start gap-6">
        <Avatar className="w-20 h-20">
          <AvatarFallback className="text-2xl">ИП</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">Иван Петров</h1>
          <p className="text-muted-foreground mb-4">ivan.petrov@example.com</p>
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={16} className="mr-2" />
            Настройки
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Мои вещи</h2>
          <Button>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить вещь
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockItems.filter(item => item.owner === "Иван П.").map(item => (
            <ItemCard key={item.id} item={item} showActions />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Поиск вещей</h1>
        <p className="text-muted-foreground">Найдите нужную вещь по названию или описанию</p>
      </div>
      <div className="relative max-w-2xl">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск по названию или описанию..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {searchQuery && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Найдено: {filteredItems.length} {filteredItems.length === 1 ? 'вещь' : 'вещей'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ArrowLeftRight" size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg">LendIt</span>
          </button>
          
          <div className="flex items-center gap-1">
            <Button
              variant={currentPage === "home" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("home")}
              className="gap-2"
            >
              <Icon name="Home" size={18} />
              <span className="hidden sm:inline">Главная</span>
            </Button>
            <Button
              variant={currentPage === "catalog" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("catalog")}
              className="gap-2"
            >
              <Icon name="Grid3x3" size={18} />
              <span className="hidden sm:inline">Каталог</span>
            </Button>
            <Button
              variant={currentPage === "search" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("search")}
              className="gap-2"
            >
              <Icon name="Search" size={18} />
              <span className="hidden sm:inline">Поиск</span>
            </Button>
            <Button
              variant={currentPage === "profile" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("profile")}
              className="gap-2"
            >
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Профиль</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentPage === "home" && renderHome()}
        {currentPage === "catalog" && renderCatalog()}
        {currentPage === "profile" && renderProfile()}
        {currentPage === "search" && renderSearch()}
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 LendIt. Платформа для обмена вещами</p>
        </div>
      </footer>
    </div>
  );
};

const ItemCard = ({ item, showActions = false }: { item: Item; showActions?: boolean }) => (
  <Card className="group hover:shadow-md transition-shadow">
    <CardContent className="p-0">
      <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
        <Icon name="Package" size={48} className="text-muted-foreground/50" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
          <Badge variant={item.available ? "default" : "secondary"} className="shrink-0">
            {item.available ? "Доступно" : "Занято"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="User" size={14} />
            <span>{item.owner}</span>
          </div>
          {showActions ? (
            <Button variant="ghost" size="sm">
              <Icon name="MoreVertical" size={16} />
            </Button>
          ) : (
            <Button size="sm" disabled={!item.available}>
              Связаться
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Index;
