import MenuUsers from '@/components/MenuUsers'
import NavAdmin from '@/components/NavAdmin'
import Head from 'next/head'
import Link from 'next/link'

export default function Admin() {
  return (
    <>
      <Head>
        <title>Bem-vindo ao Sistema de Agenda</title>
        <meta name="description" content="Sistema de agenda para gerenciamento eficiente" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        <MenuUsers />
      </div>

      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light">
        <h1 className="display-4 mb-3">Bem-vindo ao Sistema de Agenda</h1>
        <p className="lead text-muted">
          Organize compromissos, gerencie horários e mantenha tudo sob controle em um só lugar.
        </p>
      </div>
    </>
  )
}
