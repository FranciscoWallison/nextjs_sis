// Exemplo de uso do endpoint no Next.js
export async function fetchManutencoes(filters) {
  const response = await fetch("/api/manutencoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar manutenções");
  }

  return await response.json();
}

// Exemplo de chamada do endpoint
async function getManutencoes() {
  try {
    const filters = {
      ano: "2023",
      mes: "Janeiro",
      tipoEquipamento: "Equipamento X",
    };
    const data = await fetchManutencoes(filters);
    console.log("Manutenções encontradas:", data);
    // Aqui você pode atualizar o estado do seu componente com os dados recebidos
  } catch (error) {
    console.error("Erro ao buscar manutenções:", error);
  }
}
