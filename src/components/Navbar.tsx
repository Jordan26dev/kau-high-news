export default function Navbar() {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-3xl font-bold">Kau High News</h1>

        <nav>
          <ul className="flex gap-6 font-medium">
            <li>Home</li>
            <li>News</li>
            <li>Sports</li>
            <li>Clubs</li>
            <li>Opinion</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
