import Header from "../components/header";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode,
  }) {
    return (
      <section>
        <h1>Layout Component</h1>
        {children}
      </section>
    );
  }