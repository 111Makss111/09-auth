type PrivateRoutesLayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function PrivateRoutesLayout({
  children,
  modal,
}: PrivateRoutesLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
