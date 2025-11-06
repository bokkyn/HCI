type Page = {
  title: string;
  path: `/${string}`;
};


const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Log In",
    path: "/login",
  },
  {
    title: "Profil",
    path: "/profil",
  },
  {
    title: "Dodaj Ture",
    path: "/dodaj_ture",
  },
  {
    title: "Istraži Ture",
    path: "/istrazi_ture",
  },
  {
    title: "Blog",
    path: "/blog",
  },
  {
    title: "Pomoć",
    path: "/pomoc",
  },
];


function processPage(page: Page, index: number) {
  return (
    <li key={index}>
      <a href={page.path}>{page.title}</a>
    </li>
  );
}

export function Navigation() {
  return (
    <nav>
      <ul className="flex space-x-4 mb-4">{pages.map(processPage)}</ul>
    </nav>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <Navigation />
      <h1 className="text-6xl font-extrabold tracking-tight">Home page</h1>
    </main>
  );
}