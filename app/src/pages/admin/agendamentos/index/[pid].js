import React, { useState, useEffect } from "react";
import Axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import NavAdmin from '@/components/NavAdmin';
import MenuUsers from '@/components/MenuUsers';
import AppointmentAction from '@/components/AppointmentAction';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);
  const [nomeProfissional, setNomeProfissional] = useState("");
  const router = useRouter();
  const { pid } = router.query;

  const API_URL = "http://localhost:8080/api/agendamentos/idProfissionais/";
  const API_URL_PROFISSIONAL = "http://localhost:8080/api/profissionais/nome/";

  useEffect(() => {
    if (pid) {
      const fetchAgendamentos = async () => {
        try {
          const response = await Axios.get(`${API_URL}${pid}`);
          setAgendamentos(response.data);
        } catch (error) {
          console.error("Erro ao buscar agendamentos:", error);
        }
      };

      const fetchProfissional = async () => {
        try {
          const response = await Axios.get(API_URL_PROFISSIONAL + pid);
          setNomeProfissional(`${response.data.primeiroNome} ${response.data.ultimoNome}`);
        } catch (error) {
          console.error("Erro ao buscar o nome do profissional:", error);
        }
      };

      fetchAgendamentos();
      fetchProfissional();
    }
  }, [pid]);

  const getCurrentWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        day: day.getDate(),
        weekday: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][day.getDay()],
        fullDate: day,
      });
    }
    return weekDays;
  };

  const currentWeek = getCurrentWeek(currentDate);

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const getAgendamentosForDay = (date) => {
    return agendamentos.filter((agendamento) => {
      const agendamentoDate = new Date(agendamento.dia);
      return agendamentoDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div style={{ background: 'linear-gradient(to top, #ffffff, #d4edda)', minHeight: '100vh' }}>
      <NavAdmin />
      <MenuUsers />

      <div className="d-flex justify-content-center mb-4">
        <div className="mr-3">
          <Link className="nav-link" href={`/admin/agendamentos/create/${pid}`}>
            <button className="btn btn-success btn-lg p-3">Cadastrar Agendamento</button>
          </Link>
        </div>

        <div className="mr-3"> 
          <Link className="nav-link" href={`/admin/agendamentos/indexDia/${pid}`}>
            <button className="btn btn-success btn-lg p-3">Filtrar Agendamentos por dia</button>
          </Link>
        </div>

        <div>
          <Link className="nav-link" href={`/admin/agendamentos/indexPaciente/${pid}`}>
            <button className="btn btn-success btn-lg p-3">Filtrar Agendamentos por paciente</button>
          </Link>
        </div>
      </div>

      <div className="container mt-4">
        <h1 className="text-center text-success">Agenda Semanal de {nomeProfissional}</h1>

        <div className="d-flex justify-content-between align-items-center my-4">
          <button className="btn btn-outline-success" onClick={() => changeWeek(-1)}>
            {"< Semana Anterior"}
          </button>
          <h4>
            Semana de {currentWeek[0].fullDate.toLocaleDateString("pt-BR")} a{" "}
            {currentWeek[6].fullDate.toLocaleDateString("pt-BR")}
          </h4>
          <button className="btn btn-outline-success" onClick={() => changeWeek(1)}>
            {"Próxima Semana >"}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center custom-table">
            <thead className="table-success">
              <tr>
                {currentWeek.map(({ day, weekday }, index) => (
                  <th key={index} className="p-3">
                    {weekday}, {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {currentWeek.map(({ fullDate }, colIndex) => {
                  const agendamentosForDay = getAgendamentosForDay(fullDate);
                  return (
                    <td key={colIndex} className="align-top">
                      {agendamentosForDay.length === 0 ? (
                        <span className="text-muted">Sem agendamentos</span>
                      ) : (
                        agendamentosForDay.map((agendamento, index) => (
                          <div key={index} className="card-agendamento" id={`agendamento-${agendamento.idAgendamentos}`}>
                            <strong>{agendamento.primPac} {agendamento.ultPac}</strong>
                            <br />
                            <span>{agendamento.horaInicio} - {agendamento.horaFim}</span>
                            <br />
                            <small>{agendamento.descricao}</small>
                            <br />
                            <AppointmentAction pid={agendamento.idAgendamentos} />
                          </div>
                        ))
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .custom-table th,
        .custom-table td {
          min-width: 250px;
          min-height: 250px;
          vertical-align: top;
          padding: 25px;
        }

        .card-agendamento {
          min-height: 150px;
          padding: 20px;
          margin-bottom: 15px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .card-agendamento strong {
          font-size: 1.2rem;
        }

        .card-agendamento small {
          display: block;
          color: #666;
        }

        .d-flex {
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .mr-3 {
          margin-right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Agenda;
