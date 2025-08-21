export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} RetroForge. All rights reserved.</p>
      </div>
    </footer>
  );
}