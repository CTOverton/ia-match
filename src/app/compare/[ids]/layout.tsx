export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={'flex'}>
      {/*<div>Sidebar</div>*/}
      {children}
    </div>
  )
}
