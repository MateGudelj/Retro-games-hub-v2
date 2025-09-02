export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-800 text-slate-400 p-4 mt-auto border-t border-slate-700">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} RGH. All rights reserved.</p>
      </div>
    </footer>
  );
}