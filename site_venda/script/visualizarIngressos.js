async function visualizarIngresso() {
  try {
      const idLogado = localStorage.getItem("clienteId");


      const urlIngressos = `https://back-end-festa-junina.onrender.com/api/Ingresso/ConsultarIngresso/${idLogado}`;
      const urlUsuarios = `https://back-end-festa-junina.onrender.com/api/Usuario`;
      const urlLotes = `https://back-end-festa-junina.onrender.com/api/Lote`;



      // Faz as duas requisições em paralelo
      const [resIngressos, resUsuarios, resLotes] = await Promise.all([
          fetch(urlIngressos),
          fetch(urlUsuarios),
          fetch(urlLotes)
      ]);

      const ingressos = await resIngressos.json();
      const usuarios = await resUsuarios.json();
      const lotes = await resLotes.json();

      if (resIngressos.ok && resUsuarios.ok) {
          console.log("Ingressos:", ingressos);
          console.log("Usuários:", usuarios);
          console.log("Usuários:", lotes);

          const container = document.querySelector(".container");
            container.innerHTML = ""; // limpa os cards antigos

            ingressos.forEach(ingresso => {
                // Busca o nome do usuário correspondente ao usuario_id
                const usuario = usuarios.find(u => u.id === ingresso.usuario_id);
                const nomeUsuario = usuario ? usuario.nome : "Usuário Desconhecido";

                const lote = lotes.find(l => l.id === ingresso.lote_id);
                const valorUn = lote ? lote.valor_un.toFixed(2) : "10,00";
                const numeroLote = lote ? lote.nome || lote.id : ingresso.lote_id;

                let tipo = "";
                let statusClass = "";
                switch (ingresso.status_id) {
                    case 1:
                        tipo = "pendente";
                        statusClass = "pendente";
                        break;
                    case 2:
                        tipo = "pago";
                        statusClass = "pago";
                        break;
                    case 3:
                    default:
                        tipo = "cancelado";
                        statusClass = "cancelado";
                        break;
                }

                const card = document.createElement("div");
                card.className = "card-ingresso";


                if (tipo == "pago")
                {
                    card.innerHTML = `
                        <div class="card-topo">Ingressos Adquiridos</div>
                        <div class="card-conteudo">
                            <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                            <img src="https://back-end-festa-junina.onrender.com/qrcodes/${ingresso.qrcode}.png" alt="QR Code" id="qrcode">
                            <p class="status ${statusClass}">Pedido ${tipo}</p>
                            <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                            <span id="valor">R$${lote.valor_un.toFixed(2) || "10,00"}</span></p>
                            <div class="btns"> 
                            </div>
                            <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                        </div>
                    `;
                    container.appendChild(card);
                }
                else if (tipo == "pendente")
                {
                    card.innerHTML = `
                        <div class="card-topo">Ingressos Adquiridos</div>
                        <div class="card-conteudo">
                            <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                            <img src="../img/a64784b6-eb50-4131-a1af-2694027ee471.png" alt="QR Code" id="qrcode">
                            <p class="status ${statusClass}">Pedido ${tipo}</p>
                            <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                            <span id="valor">R$${lote.valor_un.toFixed(2) || "10,00"}</span></p>
                            <div class="btns">  
                                <button id="botao_cancelar"">Cancelar</button>
                            </div>
                            <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                        </div>
                    `;
                    container.appendChild(card);
                }
                else if(tipo == "cancelado"){
                    
                }
            });

        } else {
            alert("Erro ao buscar dados.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição: " + error.message);
    }
    async function deletarIngresso(id) {
        const confirmacao = confirm("Tem certeza que deseja deletar este ingresso cancelado?");
        if (!confirmacao) return;
    
        try {
            const response = await fetch(`http://10.90.146.37/api/api/Ingresso/CancelarIngresso/${id}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                alert("Ingresso deletado com sucesso!");
                visualizarIngresso(); // recarrega os ingressos após a exclusão
            } else {
                const erro = await response.json();
                alert("Erro ao deletar ingresso: " + (erro.message || "Tente novamente."));
            }
        } catch (error) {
            alert("Erro na requisição: " + error.message);
        }
    }
    const cancelar = document.getElementById("botao_cancelar");
    cancelar.addEventListener("click", deletarIngresso)
}

visualizarIngresso()