const STORAGE_KEY = 'sistema_rotas_data';
const SESSION_KEY = 'sistema_rotas_session';

const STATUS_LIST = ['Pendente', 'Em andamento', 'Concluido', 'Finalizado', 'Cancelado'];
const TIPOS_ROTA = ['Entrega', 'Coleta'];
const TAMANHOS = ['Pequeno', 'Medio', 'Grande'];

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function defaultData() {
  return {
    senhaGestor: 'gestor123',
    motoristas: [],
    ajudantes: [],
    carros: [],
    rotas: []
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = defaultData();
      saveData(data);
      return data;
    }
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function login(senha) {
  const data = loadData();
  if (senha === data.senhaGestor) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const diaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][date.getDay()];
  return `${diaSemana}, ${d} de ${MESES[m - 1]} de ${y}`;
}

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function statusClass(status) {
  const map = {
    'Pendente': 'badge-pendente',
    'Em andamento': 'badge-em-andamento',
    'Concluido': 'badge-concluido',
    'Finalizado': 'badge-finalizado',
    'Cancelado': 'badge-cancelado'
  };
  return map[status] || 'badge-pendente';
}

function tamanhoClass(tamanho) {
  const map = { Pequeno: 'badge-pequeno', Medio: 'badge-medio', Grande: 'badge-grande' };
  return map[tamanho] || 'badge-pequeno';
}

function getTipoRota(rota) {
  return rota.tipo || 'Entrega';
}

function tipoClass(tipo) {
  return tipo === 'Coleta' ? 'badge-coleta' : 'badge-entrega';
}

function tipoIcon(tipo) {
  return tipo === 'Coleta' ? '📥' : '📦';
}

function getMotorista(id) {
  return loadData().motoristas.find(m => m.id === id);
}

function getAjudante(id) {
  if (!id) return null;
  return loadData().ajudantes.find(a => a.id === id);
}

function getCarro(id) {
  return loadData().carros.find(c => c.id === id);
}

function getRotasPorData(dataStr) {
  return loadData().rotas
    .filter(r => r.data === dataStr)
    .sort((a, b) => (a.horario || '').localeCompare(b.horario || ''));
}

function gerarTextoRota(rota, mostraData = true) {
  const carro = getCarro(rota.carroId);
  const motorista = getMotorista(rota.motoristaId);
  const ajudante = getAjudante(rota.ajudanteId);

  let texto = '';
   if (mostraData) {
    texto += `📋 ROTA - ${formatDate(rota.data)}`;
  }
 
   if (motorista) {
    texto += `👤 *Motorista: ${motorista.nome}*`;
  }
  if (rota.horario) texto += ` às ${rota.horario}`;
  texto += `\nTipo: ${getTipoRota(rota)}`;
  texto += `\nStatus: ${rota.status}`;
  texto += `\n\n📍 Origem: ${rota.origem}`;
  if (rota.parada) texto += `\n🛑 Parada: ${rota.parada}`;
  texto += `\n🏁 Destino: ${rota.destino}`;

  if (carro) {
    texto += `\n\n🚗 Carro: ${carro.placa} - ${carro.modelo} (${carro.tamanho})`;
  }
  if (ajudante) {
    texto += `\n👥 Ajudante: ${ajudante.nome}`;
  } else {
    texto += `\n👥 Ajudante: (sem ajudante)`;
  }

  if (rota.observacao) {
    texto += `\n\n📝 Observação: ${rota.observacao}`;
  }

  return texto;
}

function gerarTextoDia(dataStr) {
  const rotas = getRotasPorData(dataStr);

  if (rotas.length === 0){
    return 'Nenhuma rota neste dia.';
  } 

  let texto = `📅 AGENDA - ${formatDateLong(dataStr)}\n`;
  texto += `${'='.repeat(40)}\n`;

  rotas.forEach((rota, i) => {
    if (i > 0) {
      texto += `\n${'-'.repeat(40)}\n\n`;
    }

    texto += gerarTextoRota(rota, false);
  });

  return texto;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}
