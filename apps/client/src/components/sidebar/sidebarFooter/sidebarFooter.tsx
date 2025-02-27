'use client';

import { Button } from '@components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter as UiSidebarFooter,
} from '@components/ui/sidebar';
import { ChevronUp, LogOut, Settings, User2 } from 'lucide-react';

export default function SidebarFooter({ handleLogout }: { handleLogout: () => void }) {
	return (
		<UiSidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<Settings /> Settings
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
							<DropdownMenuItem>
								<Button className="text-xs w-full" variant="outline">
									<User2 /> Account
								</Button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button className="text-xs w-full" onClick={handleLogout}>
									<LogOut className="h-3 w-3 text-zinc-200" /> Logout
								</Button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</UiSidebarFooter>
	);
}
