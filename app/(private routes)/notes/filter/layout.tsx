type NotesFilterLayoutProps = Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>;

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <>
      <div hidden>{sidebar}</div>
      {children}
    </>
  );
}
