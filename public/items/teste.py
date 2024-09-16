import json

# Função para carregar o arquivo `items.json` com codificação UTF-8
def carregar_arquivo_items(caminho_arquivo):
    with open(caminho_arquivo, 'r', encoding='utf-8') as file:
        return json.load(file)

# Função para extrair periodicidade e criar um novo arquivo JSON sem repetições
def criar_arquivo_periodicidade(listaObjetos):
    periodicidades = []
    descricao_existente = set()  # Usado para armazenar descrições únicas

    for idx, item in enumerate(listaObjetos):
        descricao = item.get("Periodicidade")
        
        # Adicionar apenas se a descrição ainda não foi adicionada
        if descricao and descricao not in descricao_existente:
            periodicidade = {
                "id": len(periodicidades),  # Usar o índice baseado na lista filtrada
                "descricao": descricao
            }
            periodicidades.append(periodicidade)
            descricao_existente.add(descricao)  # Marcar a descrição como existente

    # Criar o arquivo `periodicidade.json` com codificação UTF-8
    with open('periodicidade.json', 'w', encoding='utf-8') as file:
        json.dump(periodicidades, file, indent=4, ensure_ascii=False)
    
    return periodicidades

# Caminho do arquivo `items.json`
caminho_arquivo = 'items.json'

# Carregar os dados do arquivo `items.json`
listaObjetos = carregar_arquivo_items(caminho_arquivo)

# Executar a função e criar o arquivo JSON com as periodicidades únicas
periodicidades = criar_arquivo_periodicidade(listaObjetos)
print("Arquivo periodicidade.json criado com sucesso!")
