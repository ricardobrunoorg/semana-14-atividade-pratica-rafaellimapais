// Inicializa o mapa centralizado no mundo com zoom 2
const map = L.map('map').setView([20, 0], 2);

// Adiciona a camada de mapa do OpenStreetMap (Gratuito)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Função para buscar dados e adicionar os marcadores
async function carregarMarcadores() {
    try {
        // Certifique-se de que o json-server está rodando
        const response = await fetch('http://localhost:3000/cidades');
        const cidades = await response.json();

        cidades.forEach(cidade => {
            // Verifica se a cidade tem coordenadas válidas
            if (cidade.lat && cidade.lng) {
                const marker = L.marker([cidade.lat, cidade.lng]).addTo(map);
                
                // Adiciona popup com o nome e categoria da cidade
                marker.bindPopup(`<b>${cidade.nome}</b><br>Categoria: ${cidade.categoria}`);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar mapa:', error);
    }
}

carregarMarcadores();