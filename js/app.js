let data = loadData();
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let diaSelecionado = todayStr();

function refreshData() {
  data = loadData();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function openModal(titulo, bodyHtml, footerHtml) {
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').innerHTML = footerHtml || '';
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  if (page === 'agenda') renderAgenda();
  if (page === 'rotas') renderRotas();
  if (page === 'carros') renderCarros();
  if (page === 'motoristas') renderMotoristas();
  if (page === 'ajudantes') renderAjudantes();
}

/* ========== MOTORISTAS ========== */
function renderMotoristas() {
  refreshData();
  const container = document.getElementById('lista-motoristas');

  if (data.motoristas.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">👤</div><p>Nenhum motorista cadastrado</p></div>`;
    return;
  }

  container.innerHTML = data.motoristas.map(m => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${esc(m.nome)}</span>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="editMotorista('${m.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMotorista('${m.id}')">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

function motoristaForm(m = null) {
  return `
    <div class="form-group">
      <label>Nome *</label>
      <input class="input" id="f-nome" value="${m ? esc(m.nome) : ''}" required>
    </div>
  `;
}

function saveMotorista(id) {
  const nome = document.getElementById('f-nome').value.trim();
  if (!nome) { showToast('Nome é obrigatório'); return; }

  refreshData();
  const item = {
    id: id || generateId(),
    nome,
  };

  if (id) {
    const idx = data.motoristas.findIndex(m => m.id === id);
    data.motoristas[idx] = item;
  } else {
    data.motoristas.push(item);
  }

  saveData(data);
  closeModal();
  renderMotoristas();
  showToast(id ? 'Motorista atualizado' : 'Motorista cadastrado');
}

function editMotorista(id) {
  refreshData();
  const m = data.motoristas.find(x => x.id === id);
  openModal('Editar Motorista', motoristaForm(m), `
    <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveMotorista('${id}')">Salvar</button>
  `);
}

function deleteMotorista(id) {
  if (!confirm('Excluir este motorista?')) return;
  refreshData();
  data.motoristas = data.motoristas.filter(m => m.id !== id);
  data.carros.forEach(c => { if (c.motoristaId === id) c.motoristaId = ''; });
  data.rotas.forEach(r => { if (r.motoristaId === id) r.motoristaId = ''; });
  saveData(data);
  renderMotoristas();
  showToast('Motorista excluído');
}

/* ========== AJUDANTES ========== */
function renderAjudantes() {
  refreshData();
  const container = document.getElementById('lista-ajudantes');

  if (data.ajudantes.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">👥</div><p>Nenhum ajudante cadastrado</p></div>`;
    return;
  }

  container.innerHTML = data.ajudantes.map(a => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${esc(a.nome)}</span>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="editAjudante('${a.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAjudante('${a.id}')">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

function ajudanteForm(a = null) {
  return `
    <div class="form-group">
      <label>Nome *</label>
      <input class="input" id="f-nome" value="${a ? esc(a.nome) : ''}" required>
    </div>
  `;
}

function saveAjudante(id) {
  const nome = document.getElementById('f-nome').value.trim();
  if (!nome) { showToast('Nome é obrigatório'); return; }

  refreshData();
  const item = {
    id: id || generateId(),
    nome,
  };

  if (id) {
    const idx = data.ajudantes.findIndex(a => a.id === id);
    data.ajudantes[idx] = item;
  } else {
    data.ajudantes.push(item);
  }

  saveData(data);
  closeModal();
  renderAjudantes();
  showToast(id ? 'Ajudante atualizado' : 'Ajudante cadastrado');
}

function editAjudante(id) {
  refreshData();
  const a = data.ajudantes.find(x => x.id === id);
  openModal('Editar Ajudante', ajudanteForm(a), `
    <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveAjudante('${id}')">Salvar</button>
  `);
}

function deleteAjudante(id) {
  if (!confirm('Excluir este ajudante?')) return;
  refreshData();
  data.ajudantes = data.ajudantes.filter(a => a.id !== id);
  data.rotas.forEach(r => { if (r.ajudanteId === id) r.ajudanteId = ''; });
  saveData(data);
  renderAjudantes();
  showToast('Ajudante excluído');
}

/* ========== CARROS ========== */
function renderCarros() {
  refreshData();
  const container = document.getElementById('lista-carros');

  if (data.carros.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🚗</div><p>Nenhum carro cadastrado</p></div>`;
    return;
  }

  container.innerHTML = data.carros.map(c => {
    const mot = getMotorista(c.motoristaId);
    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">${esc(c.placa)}</span>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" onclick="editCarro('${c.id}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCarro('${c.id}')">Excluir</button>
          </div>
        </div>
        <div class="card-body">
          <p><strong>Modelo:</strong> ${esc(c.modelo)} <span class="badge ${tamanhoClass(c.tamanho)}">${esc(c.tamanho)}</span></p>
          <p><strong>Motorista:</strong> ${mot ? esc(mot.nome) : '<em style="opacity:.6">Não vinculado</em>'}</p>
        </div>
      </div>
    `;
  }).join('');
}

function carroForm(c = null) {
  refreshData();
  const motOptions = data.motoristas.map(m =>
    `<option value="${m.id}" ${c && c.motoristaId === m.id ? 'selected' : ''}>${esc(m.nome)}</option>`
  ).join('');

  const tamOptions = TAMANHOS.map(t =>
    `<option value="${t}" ${c && c.tamanho === t ? 'selected' : ''}>${t}</option>`
  ).join('');

  return `
    <div class="form-row">
      <div class="form-group">
        <label>Placa *</label>
        <input class="input" id="f-placa" value="${c ? esc(c.placa) : ''}" placeholder="ABC-1234" required>
      </div>
      <div class="form-group">
        <label>Modelo *</label>
        <input class="input" id="f-modelo" value="${c ? esc(c.modelo) : ''}" placeholder="Fiat Fiorino" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Tamanho *</label>
        <select class="select" id="f-tamanho">${tamOptions}</select>
      </div>
      <div class="form-group">
        <label>Motorista</label>
        <select class="select" id="f-motorista">
          <option value="">Sem motorista</option>
          ${motOptions}
        </select>
      </div>
    </div>
  `;
}

function saveCarro(id) {
  const placa = document.getElementById('f-placa').value.trim();
  const modelo = document.getElementById('f-modelo').value.trim();
  if (!placa || !modelo) { showToast('Placa e modelo são obrigatórios'); return; }

  refreshData();
  const item = {
    id: id || generateId(),
    placa,
    modelo,
    tamanho: document.getElementById('f-tamanho').value,
    motoristaId: document.getElementById('f-motorista').value
  };

  if (id) {
    const idx = data.carros.findIndex(c => c.id === id);
    data.carros[idx] = item;
  } else {
    data.carros.push(item);
  }

  saveData(data);
  closeModal();
  renderCarros();
  showToast(id ? 'Carro atualizado' : 'Carro cadastrado');
}

function editCarro(id) {
  refreshData();
  const c = data.carros.find(x => x.id === id);
  openModal('Editar Carro', carroForm(c), `
    <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveCarro('${id}')">Salvar</button>
  `);
}

function deleteCarro(id) {
  if (!confirm('Excluir este carro?')) return;
  refreshData();
  data.carros = data.carros.filter(c => c.id !== id);
  data.rotas.forEach(r => { if (r.carroId === id) r.carroId = ''; });
  saveData(data);
  renderCarros();
  showToast('Carro excluído');
}

/* ========== ROTAS ========== */
function rotaForm(r = null, dataPre = null) {
  refreshData();
  const carOptions = data.carros.map(c => {
    const mot = getMotorista(c.motoristaId);
    const label = `${c.placa} - ${c.modelo} (${c.tamanho})${mot ? ' | ' + mot.nome : ''}`;
    return `<option value="${c.id}" ${(r && r.carroId === c.id) ? 'selected' : ''}>${esc(label)}</option>`;
  }).join('');

  const motOptions = data.motoristas.map(m =>
    `<option value="${m.id}" ${(r && r.motoristaId === m.id) ? 'selected' : ''}>${esc(m.nome)}</option>`
  ).join('');

  const ajOptions = data.ajudantes.map(a =>
    `<option value="${a.id}" ${(r && r.ajudanteId === a.id) ? 'selected' : ''}>${esc(a.nome)}</option>`
  ).join('');

  const statusOptions = STATUS_LIST.map(s =>
    `<option value="${s}" ${(r && r.status === s) || (!r && s === 'Pendente') ? 'selected' : ''}>${s}</option>`
  ).join('');

  const tipoOptions = TIPOS_ROTA.map(t =>
    `<option value="${t}" ${(r && getTipoRota(r) === t) || (!r && t === 'Entrega') ? 'selected' : ''}>${t}</option>`
  ).join('');

  const dataVal = r ? r.data : (dataPre || todayStr());
  const horarioVal = r ? (r.horario || '') : '';

  return `
    <div class="form-row">
      <div class="form-group">
        <label>Data *</label>
        <input type="date" class="input" id="f-data" value="${dataVal}" required>
      </div>
      <div class="form-group">
        <label>Horário</label>
        <input type="time" class="input" id="f-horario" value="${horarioVal}">
      </div>
    </div>
    <div class="form-group">
      <label>Tipo *</label>
      <select class="select" id="f-tipo">${tipoOptions}</select>
    </div>
    <div class="form-group">
      <label>Origem *</label>
      <input class="input" id="f-origem" value="${r ? esc(r.origem) : ''}" placeholder="Endereço de origem" required>
    </div>
    <div class="form-group">
      <label>Parada <span class="form-hint">(opcional)</span></label>
      <input class="input" id="f-parada" value="${r ? esc(r.parada || '') : ''}" placeholder="Endereço de parada">
    </div>
    <div class="form-group">
      <label>Destino *</label>
      <input class="input" id="f-destino" value="${r ? esc(r.destino) : ''}" placeholder="Endereço de destino" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Carro</label>
        <select class="select" id="f-carro" onchange="onCarroChange()">
          <option value="">Selecione</option>
          ${carOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select class="select" id="f-status">${statusOptions}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Motorista</label>
        <select class="select" id="f-motorista">
          <option value="">Selecione</option>
          ${motOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Ajudante <span class="form-hint">(opcional)</span></label>
        <select class="select" id="f-ajudante">
          <option value="">Sem ajudante</option>
          ${ajOptions}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Observação</label>
      <textarea class="textarea" id="f-observacao" placeholder="Informações adicionais...">${r ? esc(r.observacao || '') : ''}</textarea>
    </div>
  `;
}

function onCarroChange() {
  refreshData();
  const carroId = document.getElementById('f-carro').value;
  if (!carroId) return;
  const carro = data.carros.find(c => c.id === carroId);
  if (carro && carro.motoristaId) {
    document.getElementById('f-motorista').value = carro.motoristaId;
  }
}

function saveRota(id) {
  const origem = document.getElementById('f-origem').value.trim();
  const destino = document.getElementById('f-destino').value.trim();
  const dataVal = document.getElementById('f-data').value;

  if (!origem || !destino || !dataVal) {
    showToast('Data, origem e destino são obrigatórios');
    return;
  }

  refreshData();
  const item = {
    id: id || generateId(),
    data: dataVal,
    horario: document.getElementById('f-horario').value,
    tipo: document.getElementById('f-tipo').value,
    origem,
    parada: document.getElementById('f-parada').value.trim(),
    destino,
    carroId: document.getElementById('f-carro').value,
    motoristaId: document.getElementById('f-motorista').value,
    ajudanteId: document.getElementById('f-ajudante').value,
    observacao: document.getElementById('f-observacao').value.trim(),
    status: document.getElementById('f-status').value
  };

  if (id) {
    const idx = data.rotas.findIndex(r => r.id === id);
    data.rotas[idx] = item;
  } else {
    data.rotas.push(item);
  }

  saveData(data);
  closeModal();
  diaSelecionado = dataVal;
  renderAgenda();
  renderRotas();
  showToast(id ? 'Rota atualizada' : 'Rota criada');
}

function editRota(id) {
  refreshData();
  const r = data.rotas.find(x => x.id === id);
  openModal('Editar Rota', rotaForm(r), `
    <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveRota('${id}')">Salvar</button>
  `);
}

function deleteRota(id) {
  if (!confirm('Excluir esta rota?')) return;
  refreshData();
  data.rotas = data.rotas.filter(r => r.id !== id);
  saveData(data);
  renderAgenda();
  renderRotas();
  showToast('Rota excluída');
}

function shareRota(id) {
  refreshData();
  const rota = data.rotas.find(r => r.id === id);
  if (!rota) return;
  const texto = gerarTextoRota(rota);
  openModal('Compartilhar Rota', `
    <div class="share-box" id="share-text">${esc(texto)}</div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">Fechar</button>
    <button class="btn btn-success" onclick="copyShareText()">📋 Copiar Texto</button>
  `);
}

function copyShareText() {
  const text = document.getElementById('share-text').textContent;
  copyToClipboard(text).then(() => showToast('Texto copiado!'));
}

function shareDia(dataStr) {
  const texto = gerarTextoDia(dataStr);
  openModal('Compartilhar Agenda do Dia', `
    <div class="share-box" id="share-text">${esc(texto)}</div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">Fechar</button>
    <button class="btn btn-success" onclick="copyShareText()">📋 Copiar Texto</button>
  `);
}

function renderRotaCard(r) {
  const carro = getCarro(r.carroId);
  const motorista = getMotorista(r.motoristaId);
  const ajudante = getAjudante(r.ajudanteId);
  const tipo = getTipoRota(r);

  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${tipoIcon(tipo)} ${esc(r.origem)} → ${esc(r.destino)}</span>
        <div style="display:flex;gap:.35rem;flex-shrink:0">
          <span class="badge ${tipoClass(tipo)}">${esc(tipo)}</span>
          <span class="badge ${statusClass(r.status)}">${esc(r.status)}</span>
        </div>
      </div>
      <div class="card-body">
        <p><strong>Data:</strong> ${formatDate(r.data)}${r.horario ? ' às ' + r.horario : ''}</p>
        ${r.parada ? `<p><strong>Parada:</strong> ${esc(r.parada)}</p>` : ''}
        ${carro ? `<p><strong>Carro:</strong> ${esc(carro.placa)} (${esc(carro.tamanho)})</p>` : ''}
        ${motorista ? `<p><strong>Motorista:</strong> ${esc(motorista.nome)}</p>` : ''}
        ${ajudante ? `<p><strong>Ajudante:</strong> ${esc(ajudante.nome)}</p>` : '<p><strong>Ajudante:</strong> <em>Sem ajudante</em></p>'}
        ${r.observacao ? `<p><strong>Obs:</strong> ${esc(r.observacao)}</p>` : ''}
      </div>
      <div class="card-actions" style="margin-top:.75rem">
        <button class="btn btn-ghost btn-sm" onclick="shareRota('${r.id}')">📤 Compartilhar</button>
        <button class="btn btn-ghost btn-sm" onclick="editRota('${r.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRota('${r.id}')">Excluir</button>
      </div>
    </div>
  `;
}

function renderRotas() {
  refreshData();
  const filtroData = document.getElementById('filtro-data').value;
  const filtroStatus = document.getElementById('filtro-status').value;
  const filtroTipo = document.getElementById('filtro-tipo').value;
  const container = document.getElementById('lista-rotas');

  let rotas = [...data.rotas].sort((a, b) => {
    const cmp = b.data.localeCompare(a.data);
    return cmp !== 0 ? cmp : (a.horario || '').localeCompare(b.horario || '');
  });

  if (filtroData) rotas = rotas.filter(r => r.data === filtroData);
  if (filtroStatus) rotas = rotas.filter(r => r.status === filtroStatus);
  if (filtroTipo) rotas = rotas.filter(r => getTipoRota(r) === filtroTipo);

  if (rotas.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🛣️</div><p>Nenhuma rota encontrada</p></div>`;
    return;
  }

  container.innerHTML = rotas.map(r => renderRotaCard(r)).join('');
}

/* ========== AGENDA ========== */
function renderCalendario() {
  refreshData();
  const cal = document.getElementById('calendario');
  document.getElementById('mes-atual').textContent = `${MESES[mesAtual]} ${anoAtual}`;

  const firstDay = new Date(anoAtual, mesAtual, 1);
  const lastDay = new Date(anoAtual, mesAtual + 1, 0);
  const startPad = firstDay.getDay();

  let html = DIAS_SEMANA.map(d => `<div class="cal-header">${d}</div>`).join('');

  const prevMonthDays = new Date(anoAtual, mesAtual, 0).getDate();
  for (let i = startPad - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month">${prevMonthDays - i}</div>`;
  }

  const hoje = todayStr();
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rotasDia = data.rotas.filter(r => r.data === dateStr);
    const count = rotasDia.length;
    const classes = ['cal-day'];
    if (dateStr === hoje) classes.push('today');
    if (dateStr === diaSelecionado) classes.push('selected');
    if (count > 0) classes.push(count > 1 ? 'has-routes many' : 'has-routes');

    html += `<div class="${classes.join(' ')}" data-date="${dateStr}" ${count > 1 ? `data-count="${count}"` : ''} onclick="selectDia('${dateStr}')">${d}</div>`;
  }

  const totalCells = startPad + lastDay.getDate();
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="cal-day other-month">${i}</div>`;
  }

  cal.innerHTML = html;
  renderRotasDoDia();
}

function renderRotasDoDia() {
  refreshData();
  const titulo = document.getElementById('dia-selecionado-titulo');
  const container = document.getElementById('rotas-do-dia');

  if (!diaSelecionado) {
    titulo.textContent = 'Selecione um dia';
    container.innerHTML = '';
    return;
  }

  titulo.textContent = formatDateLong(diaSelecionado);
  const rotas = getRotasPorData(diaSelecionado);

  if (rotas.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:1.5rem">
        <p>Nenhuma rota neste dia</p>
        <button class="btn btn-primary btn-sm" style="margin-top:.75rem" onclick="novaRota('${diaSelecionado}')">+ Adicionar Rota</button>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div style="display:flex;gap:.5rem;margin-bottom:1rem;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="novaRota('${diaSelecionado}')">+ Nova Rota</button>
      <button class="btn btn-ghost btn-sm" onclick="shareDia('${diaSelecionado}')">📤 Compartilhar Dia</button>
    </div>
    ${rotas.map(r => {
      const motorista = getMotorista(r.motoristaId);
      const carro = getCarro(r.carroId);
      const tipo = getTipoRota(r);
      return `
        <div class="rota-item">
          <div class="rota-item-info">
            <h4>${tipoIcon(tipo)} ${r.horario ? r.horario + ' - ' : ''}${esc(r.origem)} → ${esc(r.destino)}</h4>
            <p>
              <span class="badge ${tipoClass(tipo)}">${esc(tipo)}</span>
              <span class="badge ${statusClass(r.status)}">${esc(r.status)}</span>
            ${carro ? ` · ${esc(carro.placa)}` : ''}
            ${motorista ? ` · ${esc(motorista.nome)}` : ''}</p>
            ${r.parada ? `<p>Parada: ${esc(r.parada)}</p>` : ''}
          </div>
          <div class="rota-item-actions">
            <button class="btn btn-ghost btn-sm" onclick="shareRota('${r.id}')">📤</button>
            <button class="btn btn-ghost btn-sm" onclick="editRota('${r.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRota('${r.id}')">🗑️</button>
          </div>
        </div>`;
    }).join('')}
  `;
}

function selectDia(dateStr) {
  diaSelecionado = dateStr;
  renderCalendario();
}

function renderAgenda() {
  renderCalendario();
}

function novaRota(dataPre) {
  openModal('Nova Rota', rotaForm(null, dataPre), `
    <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveRota()">Criar Rota</button>
  `);
}

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ========== INIT ========== */
function initApp() {
  if (isLoggedIn()) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    renderAgenda();
  } else {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const senha = document.getElementById('senha').value;
    if (login(senha)) {
      initApp();
    } else {
      showToast('Senha incorreta');
    }
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    logout();
    initApp();
    document.getElementById('senha').value = '';
  });

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  document.getElementById('modal-fechar').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  document.getElementById('btn-nova-rota').addEventListener('click', () => novaRota());
  document.getElementById('btn-nova-rota-agenda').addEventListener('click', () => novaRota(diaSelecionado));

  const btnCompartilharDia = document.getElementById('btn-compartilhar-dia');
  if (btnCompartilharDia) {
    btnCompartilharDia.addEventListener('click', () => {
      const alvo = diaSelecionado || todayStr();
      shareDia(alvo);
    });
  }

  document.getElementById('btn-novo-motorista').addEventListener('click', () => {
    openModal('Novo Motorista', motoristaForm(), `
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveMotorista()">Cadastrar</button>
    `);
  });

  document.getElementById('btn-novo-ajudante').addEventListener('click', () => {
    openModal('Novo Ajudante', ajudanteForm(), `
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveAjudante()">Cadastrar</button>
    `);
  });

  document.getElementById('btn-novo-carro').addEventListener('click', () => {
    openModal('Novo Carro', carroForm(), `
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveCarro()">Cadastrar</button>
    `);
  });

  document.getElementById('btn-mes-anterior').addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    renderCalendario();
  });

  document.getElementById('btn-mes-proximo').addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
    renderCalendario();
  });

  document.getElementById('btn-hoje').addEventListener('click', () => {
    const now = new Date();
    mesAtual = now.getMonth();
    anoAtual = now.getFullYear();
    diaSelecionado = todayStr();
    renderCalendario();
  });

  document.getElementById('filtro-data').addEventListener('change', renderRotas);
  document.getElementById('filtro-status').addEventListener('change', renderRotas);
  document.getElementById('filtro-tipo').addEventListener('change', renderRotas);
  document.getElementById('btn-limpar-filtros').addEventListener('click', () => {
    document.getElementById('filtro-data').value = '';
    document.getElementById('filtro-status').value = '';
    document.getElementById('filtro-tipo').value = '';
    renderRotas();
  });

  initApp();
});
