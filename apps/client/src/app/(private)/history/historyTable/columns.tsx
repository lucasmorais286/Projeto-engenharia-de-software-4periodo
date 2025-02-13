"use client"

import { PostEntityWithDetails } from "@common/interfaces/post"
import { ColumnDef } from "@tanstack/react-table"
import { UserUi } from "./components/UserUi/UserUi"
import { ActionsDropdown } from "./components/ActionsDropdown/ActionsDropdown"
import { StatusBadge } from "./components/StatusBadge/StatusBadge"


export const columns: ColumnDef<PostEntityWithDetails>[] = [
  {
    accessorKey: "account",
    header: "Conta",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const accountA = rowA.original.account
      const accountB = rowB.original.account

      if (!accountA?.username || !accountB?.username) return 0
      return accountA.username.localeCompare(accountB.username)
    },
    filterFn: (row, _, filterValue) => {
      const account = row.original.account
      if (!account?.username) return false
      return account.username.toLowerCase().includes(filterValue.toLowerCase())
    },
    cell: ({ row }) => <UserUi image={row.original.account?.profilePicUrl} username={row.original.account?.username ?? "Desconhecido"} />

  },
  {
    accessorKey: "user",
    header: "Usuário",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const userA = rowA.original.user
      const userB = rowB.original.user

      if (!userA?.name || !userB?.name) return 0
      return userA.name.localeCompare(userB.name)
    },
    filterFn: (row, _, filterValue) => {
      const user = row.original.user
      console.log(row.original.comments)
      if (!user?.name) return false
      return user.name.toLowerCase().includes(filterValue.toLowerCase())
    },
    cell: ({ row }) => <UserUi image={row.original?.user?.profilePicUrl} username={row.original?.user?.name ?? "Desconhecido"} />
  },
  {
    accessorKey: "caption",
    header: "Legenda",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "arrIncludes",
  },
  {
    accessorKey: "scheduledAt",
    header: "Agendado para",
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("scheduledAt") as string
      return value ? new Date(value).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' }) : "Não agendado"
    }
  },
  {
    accessorKey: "publishedAt",
    header: "Publicado em",
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("publishedAt") as string
      return value ? new Date(value).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' }) : "Não publicado"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt
      const scheduledAt = row.original.scheduledAt
      const canceledAt = row.original.canceledAt

      if (canceledAt) return <StatusBadge status="Cancelado" />
      if (publishedAt) return <StatusBadge status="Publicado" />
      if (scheduledAt) return <StatusBadge status="Agendado" />
    }
  },
  {
    accessorKey: "actions",
    header: "Ações",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => <ActionsDropdown post={row.original} />
  }
]
