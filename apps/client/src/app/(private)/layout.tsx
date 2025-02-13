import { Sidebar, Header } from '@components/index';
import { SidebarProvider } from '@components/ui/sidebar';
import { ToastContainer } from 'react-toastify';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<ToastContainer />
			<SidebarProvider defaultOpen={true}>
				<Sidebar />
				<div className="flex flex-col w-full h-screen">
					<Header />
					{children}
				</div>
			</SidebarProvider>
		</>
	);
}
