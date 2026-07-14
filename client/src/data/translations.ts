import type { QuestionTranslation } from '../game/types'

export const QUESTION_TRANSLATIONS: Record<string, QuestionTranslation> = {
  Q8: {
    prompt:
      'Revisões de produção revelam tratamento inconsistente da incerteza nos relatórios finais. Às vezes achados conflitantes de subagentes são sintetizados em uma única afirmação confiante (perdendo nuance), enquanto outras vezes os relatórios exageram nas ressalvas (ficando inúteis). Quando o agente de busca web retorna "analistas do setor estimam mercado de $50B (metodologia varia)" e o agente de análise de documentos retorna "estudo revisado por pares estima 35B (±7B, IC 95%)", o coordenador ou escolhe um arbitrariamente ou produz afirmações vagas como "o mercado pode ser 35B–50B dependendo de fatores". Qual abordagem sistemática resolve melhor isso?',
    options: [
      'Configurar os subagentes para reportar apenas achados que atinjam um limiar de alta confiança, filtrando informações incertas antes que cheguem ao coordenador.',
      'Implementar uma camada de calibração de confiança que normaliza as expressões de incerteza dos subagentes em escores de probabilidade padronizados (0.0–1.0) e então faz média ponderada dos achados pela confiança calibrada.',
      'Instruir o agente de síntese a estruturar os relatórios com seções explícitas distinguindo achados bem estabelecidos dos contestados, preservando as caracterizações originais das fontes e o contexto metodológico.',
      'Adicionar um subagente de verificação que faz referência cruzada dos achados entre fontes, passando para a síntese apenas afirmações corroboradas por pelo menos duas fontes independentes.',
    ],
    explanation:
      'Uma estrutura de relatório que mantém o contexto metodológico e separa afirmações consolidadas das contestadas é como se obtém nuance sem exagerar nas ressalvas.',
  },
  Q4: {
    prompt:
      'O agente de busca web reuniu várias fontes relevantes para um tópico de pesquisa. Agora o agente de análise de documentos precisa examinar essas fontes. Como a informação normalmente flui entre esses dois subagentes especializados?',
    options: [
      'Os agentes se comunicam por uma fila de mensagens orientada a eventos, com o agente de análise de documentos assinando os eventos de conclusão da busca web.',
      'O agente de busca web invoca diretamente o agente de análise de documentos, passando as fontes descobertas como parâmetros.',
      'O agente coordenador recebe a saída do agente de busca web e inclui os achados relevantes no prompt ao invocar o agente de análise de documentos.',
      'Ambos os agentes acessam um armazenamento de memória compartilhada onde o agente de busca web escreve os achados e o agente de análise de documentos os lê.',
    ],
    explanation:
      'No padrão orquestrador-trabalhador, o coordenador é o hub. Ele coleta a saída de cada subagente e encaminha explicitamente as partes relevantes para o prompt do próximo subagente.',
  },
  Q2: {
    prompt:
      'Depois que o agente de busca web encontra 25 fontes (120K tokens de conteúdo bruto), o agente de análise de documentos extrai insights principais (15K tokens) e o agente de síntese produz um rascunho de narrativa coerente (3K tokens), o coordenador precisa passar contexto ao agente de geração de relatório para a saída final com citações de fonte adequadas. Qual estratégia de passagem de contexto oferece o melhor equilíbrio entre completude e eficiência?',
    options: [
      'Passar apenas o rascunho de síntese e ter um pipeline de pós-processamento separado que associa afirmações a fontes e insere citações após o relatório ser gerado.',
      'Passar o rascunho de síntese junto com um índice de fontes estruturado que mapeia as afirmações-chave às URLs das fontes e trechos relevantes.',
      'Passar um resumo condensado de todas as etapas anteriores que preserva os principais achados e os atribui às fontes apenas pelo nome.',
      'Passar todo o contexto acumulado de todos os agentes anteriores.',
    ],
    explanation:
      'A síntese dá a narrativa; o índice de fontes dá ao gerador de relatório exatamente o vínculo necessário para citar sem reler 120K tokens de conteúdo bruto.',
  },
  Q7: {
    prompt:
      'O agente de síntese recebe achados resumidos dos agentes de busca web e de análise de documentos, e então passa um resumo consolidado ao gerador de relatório. Durante os testes, você descobre que os relatórios gerados fazem afirmações factuais sem citações adequadas — o gerador de relatório não consegue atribuir afirmações às fontes originais porque esses metadados foram perdidos durante as etapas de resumo. Qual a abordagem mais eficaz para garantir a atribuição correta de fontes nos relatórios finais?',
    options: [
      'Fazer cada agente emitir dados estruturados separando os resumos de conteúdo dos metadados de fonte (URLs, nomes de documentos, números de página).',
      'Fazer o gerador de relatório consultar o agente de busca web para relocalizar as fontes das afirmações no relatório final.',
      'Instruir o agente de síntese a incorporar referências de fonte inline no texto do resumo usando um formato de citação consistente.',
      'Pular o resumo e passar as saídas brutas completas da busca web e da análise de documentos diretamente ao gerador de relatório.',
    ],
    explanation:
      'Conteúdo estruturado + metadados de fonte separados preservam o mapeamento de ponta a ponta, então o gerador de relatório recebe tanto o que foi dito quanto de onde veio.',
  },
  Q10: {
    prompt:
      'Depois que os agentes de busca web e de análise de documentos concluem suas tarefas, o coordenador invoca o agente de síntese. Porém, o agente de síntese responde que não consegue concluir a tarefa porque nenhum achado de pesquisa foi fornecido. Qual a causa mais provável desse problema?',
    options: [
      'A janela de contexto do agente de síntese não é grande o suficiente para conter as saídas combinadas dos dois agentes anteriores.',
      'O coordenador não incluiu as saídas dos agentes anteriores no prompt do agente de síntese.',
      'Os subagentes precisam compartilhar uma única conexão de API para permitir o compartilhamento automático de contexto entre invocações.',
      'O agente de síntese precisa de ferramentas que busquem resultados diretamente dos históricos de conversa dos outros agentes.',
    ],
    explanation:
      'As invocações de subagentes são isoladas — nada flui entre elas a menos que o coordenador coloque explicitamente no prompt. A mensagem "nenhum achado fornecido" é exatamente o que se veria.',
  },
  Q12: {
    prompt:
      'O coordenador fornece instruções detalhadas passo a passo ao subagente de busca web, especificando consultas exatas, prioridades de fonte e filtros de data. O monitoramento de produção revela três problemas: (1) o subagente reporta "resultados insuficientes" em vez de tentar abordagens alternativas quando as buscas pré-especificadas falham, (2) a qualidade da pesquisa cai para tópicos emergentes que não correspondem aos padrões esperados, e (3) o subagente raramente traz fontes tangenciais valiosas. Qual a forma mais eficaz de melhorar a adaptabilidade do subagente?',
    options: [
      'Remover totalmente os detalhes procedurais, delegando com metas simples como "pesquise X a fundo" e confiando nas capacidades gerais do subagente.',
      'Adicionar diretivas de fallback explícitas às instruções detalhadas: "Se as buscas especificadas retornarem menos de N resultados, tente formulações alternativas de consulta antes de reportar falha."',
      'Implementar uma etapa de classificação de tópico onde o coordenador categoriza as requisições como "bem definidas" ou "exploratórias" e usa estilos de instrução diferentes para cada categoria.',
      'Especificar metas de pesquisa e critérios de qualidade (amplitude de cobertura, diversidade de fontes, atualidade) em vez de passos procedurais, deixando o subagente determinar sua estratégia de busca.',
    ],
    explanation:
      'Delegue intenção e barras de qualidade, não procedimentos. O subagente pode então escolher consultas, seguir tangentes promissoras e se recuperar de becos sem saída por conta própria.',
  },
  Q13: {
    prompt:
      'O monitoramento de produção mostra que consultas de acompanhamento como "resuma o que aprendemos sobre tendências de mercado" consistentemente levam mais de 40 segundos. A investigação revela que o coordenador cria o subagente de síntese para cada requisição de resumo, passando mais de 80K tokens de achados acumulados. O coordenador já tem esses achados em seu contexto de orquestrar a pesquisa. Qual a forma mais eficaz de melhorar o tempo de resposta desses resumos de acompanhamento?',
    options: [
      'Pré-gerar e cachear resumos em múltiplas granularidades sempre que novos achados se acumulam.',
      'Fazer o coordenador tratar diretamente as requisições simples de resumo usando seu contexto existente, reservando a criação de subagentes para análises complexas.',
      'Habilitar prompt caching no subagente de síntese para reduzir a sobrecarga de transferir repetidamente os mesmos achados.',
      'Criar o subagente de síntese com contexto reduzido e fazê-lo solicitar achados específicos ao coordenador sob demanda.',
    ],
    explanation:
      'Se o coordenador já tem os achados, criar um subagente para reprocessar 80K tokens é puro desperdício. Deixe o coordenador responder aos acompanhamentos simples ele mesmo.',
  },
  Q9: {
    prompt:
      'Em produção, os relatórios finais frequentemente contêm afirmações sem atribuição adequada de fonte. A investigação mostra que, embora os agentes de busca web e de análise de documentos anexem corretamente citações às suas saídas, o agente de síntese perde o controle de quais fontes sustentam quais conclusões ao combinar os achados. Qual a mudança arquitetural mais eficaz?',
    options: [
      'Manter transcrições completas de todas as interações dos subagentes e adicionar um agente de resolução de citações para analisar os logs e determinar as atribuições antes da geração do relatório.',
      'Exigir que todos os subagentes emitam mapeamentos estruturados afirmação-fonte que o agente de síntese deve preservar e mesclar ao combinar achados de múltiplas fontes.',
      'Adicionar uma etapa de verificação onde o gerador de relatório usa correspondência por similaridade semântica com as fontes originais para reconstruir quais afirmações vieram de quais documentos.',
      'Fazer o coordenador injetar prefixos identificadores de fonte no texto antes de cada handoff, e depois analisar esses prefixos na geração do relatório para reconstruir as citações.',
    ],
    explanation:
      'Mapeamentos explícitos afirmação-fonte são uma saída de primeira classe que o agente de síntese pode mesclar de forma determinística — nenhuma atribuição é perdida durante o resumo.',
  },
  Q15: {
    prompt:
      'O agente coordenador tem `AgentDefinitions` configurados para todos os quatro subagentes especializados, cada um com descrições, prompts e restrições de ferramentas apropriadas. Durante os testes, você nota que o coordenador raciocina corretamente sobre quando delegar — ele gera mensagens como "Vou pedir ao agente de busca web para encontrar fontes sobre este tópico" — mas nenhuma execução de subagente ocorre. O coordenador então prossegue como se a delegação tivesse acontecido e continua com informações incompletas. Os logs não mostram erros. Qual a causa mais provável?',
    options: [
      'A configuração `max_tokens` do coordenador está baixa demais, fazendo a invocação da ferramenta Task ser truncada antes que o parâmetro de tipo de subagente possa ser especificado.',
      'As `AgentDefinitions` estão configuradas corretamente, mas o system prompt do coordenador não lista explicitamente os tipos de subagente disponíveis, impedindo o modelo de saber que eles podem ser invocados.',
      'A configuração allowedTools do coordenador não inclui "Task", então, embora ele possa raciocinar sobre delegação, não consegue invocar a ferramenta necessária para criar subagentes.',
      'O isolamento de contexto dos subagentes significa que as descrições de tarefa do coordenador não chegam automaticamente aos subagentes; é preciso configurar o encaminhamento explícito de contexto em ClaudeAgentOptions.',
    ],
    explanation:
      'Sem a ferramenta Task em allowedTools, o coordenador consegue falar sobre delegar mas não tem como realmente chamar um subagente — o que combina com o sintoma "raciocina sobre isso, sem execução, sem erros".',
  },
  Q1: {
    prompt:
      'Seu pipeline de pesquisa multiagente travou após processar 12 de 28 documentos. O agente de busca web tinha identificado fontes relevantes, o agente de análise de documentos tinha completado parcialmente a extração, e o sintetizador tinha começado a identificação de padrões. Você precisa retomar o processamento sem repetir trabalho nem perder a fidelidade dos achados anteriores. Qual abordagem de gestão de estado melhor equilibra fidelidade de informação com eficiência de contexto ao restaurar o estado dos agentes?',
    options: [
      'Fazer cada agente manter seu próprio arquivo de estado persistente e recarregá-lo independentemente no início de cada sessão.',
      'Persistir o log de conversa do coordenador contendo todas as delegações e respostas de tarefa, fornecendo isso aos agentes ao retomar.',
      'Fazer cada agente persistir um relatório estruturado em um local conhecido. Ao retomar, o coordenador carrega os relatórios e injeta o estado relevante nos prompts dos agentes.',
      'Indexar todas as saídas dos agentes em um vector store compartilhado. Ao retomar, cada agente consulta o store por busca semântica para recuperar achados anteriores relevantes.',
    ],
    explanation:
      'Relatórios estruturados por agente mantêm a fidelidade (os achados, com schema), deixam o coordenador no comando da orquestração e mantêm o contexto de cada subagente focado. É o padrão orquestrador + artefato compacto.',
  },
  Q5: {
    prompt:
      'Em produção, você observa que consultas simples de checagem de fatos (ex.: "Em que ano o Acordo de Paris sobre o Clima foi assinado?") percorrem todos os quatro subagentes sequencialmente, consumindo mais de 40 segundos e muitos tokens por consulta. Pesquisas comparativas complexas se beneficiam do pipeline completo. Sua distribuição de consultas é diversa e está evoluindo conforme os usuários descobrem novas aplicações. Qual a abordagem mais eficaz para otimizar para complexidade variável de consulta?',
    options: [
      'Implementar roteamento baseado em padrões que categoriza as consultas por estrutura (fato único vs. comparativa vs. analítica) e mapeia cada categoria a uma combinação predefinida de subagentes.',
      'Criar um caminho rápido para perguntas factuais que ignora os subagentes por completo, roteando todas as outras consultas pelo pipeline completo para garantir a profundidade da pesquisa.',
      'Fazer o coordenador analisar cada consulta e decidir dinamicamente quais subagentes invocar com base em sua avaliação dos requisitos da consulta.',
      'Treinar um classificador de complexidade de consulta com dados históricos rotulados para prever as combinações ótimas de subagentes, retreinando periodicamente conforme os padrões evoluem.',
    ],
    explanation:
      'Deixar o LLM coordenador raciocinar sobre cada consulta e escolher só os subagentes necessários se adapta naturalmente a uma distribuição de consultas diversa e em evolução — essa é a força do padrão orquestrador.',
  },
  Q3: {
    prompt:
      'O agente de análise de documentos tem uma única ferramenta `analyze_document` que recebe um documento e um parâmetro de instrução em texto livre. Durante a avaliação, requisições como "extraia as principais métricas financeiras" frequentemente retornam resumos narrativos, enquanto "resuma a metodologia" às vezes retorna tabelas de dados brutos. O agente de síntese reporta que 35% dos resultados de análise exigem re-requisições com instruções esclarecidas. Qual a forma mais eficaz de melhorar a confiabilidade?',
    options: [
      'Dividir a ferramenta genérica em ferramentas de propósito específico — `extract_data_points`, `summarize_content`, `verify_claim_against_source` — cada uma com contratos de entrada/saída definidos.',
      'Manter a ferramenta única, mas adicionar um parâmetro enum `analysis_type` exigindo seleção explícita entre modos de extração, resumo e verificação.',
      'Fazer o coordenador pré-classificar cada requisição de análise antes de passar as instruções ao agente de análise de documentos.',
      'Melhorar a descrição da ferramenta com exemplos detalhados mostrando como diferentes formulações de instrução devem mapear para diferentes formatos de saída.',
    ],
    explanation:
      'Instruções em texto livre colocam a semântica na prosa, que o modelo interpreta de forma inconsistente. Ferramentas de propósito específico dão ao modelo um contrato explícito e bem tipado para escolher.',
  },
  Q11: {
    prompt:
      'Um usuário está expandindo o sistema de pesquisa além do seu único agente de busca web, adicionando fontes de dados especializadas. Ele adiciona um agente de API financeira que retorna JSON estruturado com receita, margens e taxas de crescimento; um agente de monitoramento de notícias que retorna resumos em prosa de desenvolvimentos recentes; e um agente de análise de patentes que retorna listas estruturadas de áreas tecnológicas. O agente de síntese combina isso em briefings executivos. Atualmente, ele converte tudo em bullet points, fazendo as comparações financeiras perderem a clareza tabular e os resumos de notícias perderem o fluxo narrativo. Qual mudança melhoraria mais a qualidade dos briefings?',
    options: [
      'Padronizar todas as saídas dos subagentes em resumos de prosa com citações inline.',
      'Adicionar uma camada de conversão de formato entre os subagentes e a síntese que transforma todas as saídas em uma representação intermediária comum.',
      'Atualizar o agente de síntese para renderizar cada tipo de conteúdo de forma apropriada — dados financeiros como tabelas, notícias como prosa.',
      'Padronizar todas as saídas dos subagentes em JSON com campos para afirmação, evidência, fonte e confiança.',
    ],
    explanation:
      'Briefings executivos precisam de renderização mista: tabelas para números, prosa para narrativa. Pedir à síntese que preserve o formato nativo de cada entrada é a abstração certa.',
  },
  Q6: {
    prompt:
      'Ao pesquisar "adoção de energia renovável", o agente de busca web retorna estatísticas recentes (2024: 35% de adoção) enquanto o agente de análise de documentos extrai dados de relatórios internos (2022: 18% de adoção). O agente de síntese incorretamente sinaliza essas fontes como contraditórias em vez de reconhecer que os dados mostram crescimento ao longo do tempo. Qual mudança melhor permitiria ao agente de síntese interpretar corretamente tais diferenças temporais?',
    options: [
      'Exigir que os subagentes incluam datas de publicação ou de coleta de dados em suas saídas estruturadas.',
      'Adicionar um agente de resolução de conflitos que descarte automaticamente dados mais antigos quando existirem dados mais novos para a mesma métrica.',
      'Configurar o agente de busca web para retornar apenas resultados dos últimos 6 meses.',
      'Instruir o agente de síntese a sempre tratar os dados mais recentes como autoritativos e colocar os achados mais antigos em um apêndice histórico separado.',
    ],
    explanation:
      'O agente de síntese lê os dados errado porque nunca vê as datas. Fazer cada ponto de dado carregar seu próprio timestamp na saída estruturada permite à síntese raciocinar sobre tendências em vez de contradições.',
  },
  Q14: {
    prompt:
      'Ao analisar casos jurídicos complexos que citam múltiplos precedentes, o subagente de análise de documentos processa cada um sequencialmente. Um caso emblemático que cita 12 precedentes leva mais de 3 minutos para ser analisado completamente. Qual a forma mais eficaz de reduzir essa latência preservando a capacidade do coordenador de monitorar e depurar o sistema?',
    options: [
      'Implementar uma fila de mensagens onde as tarefas de análise de precedentes são processadas de forma assíncrona por um pool de agentes trabalhadores.',
      'Criar uma hierarquia recursiva de agentes onde os agentes de análise subdividem o trabalho entre agentes filhos até atingir a granularidade de um único precedente.',
      'Fazer o coordenador criar subagentes de análise de documentos em paralelo, cada um tratando um subconjunto de precedentes, e depois agregar os resultados antes da síntese.',
      'Permitir que o subagente de análise de documentos crie seus próprios subagentes especializados dinamicamente quando encontrar casos com muitas citações.',
    ],
    explanation:
      'O paralelismo gerenciado pelo coordenador distribui o trabalho, mantém o escopo de cada subagente enxuto e preserva um único hub para monitoramento e agregação.',
  },
  Q49: {
    prompt:
      'Seu pipeline de extração processa contratos que frequentemente incluem emendas. Quando um contrato contém tanto os termos originais quanto emendas posteriores (ex.: a cláusula original especifica "prazo de pagamento de 30 dias" enquanto a Emenda 1 muda para "45 dias"), o modelo extrai inconsistentemente um valor ou outro, sem indicar qual se aplica. Qual a abordagem mais eficaz para melhorar a precisão da extração em documentos com emendas?',
    options: [
      'Redesenhar o schema para que os campos emendados capturem múltiplos valores, cada um com localização da fonte e data de vigência.',
      'Adicionar instruções no prompt para sempre extrair o valor da emenda mais recente e ignorar os termos originais substituídos.',
      'Pré-processar os documentos com um classificador que identifica e remove as seções substituídas antes da etapa principal de extração.',
      'Implementar validação pós-extração usando correspondência de padrões para detectar emendas e sinalizar essas extrações para revisão manual.',
    ],
    explanation:
      'Emendas são estruturalmente sobre valores versionados. Um schema com valor + localização da fonte + data de vigência modela o domínio corretamente e para de forçar o modelo a escolher um.',
  },
  Q51: {
    prompt:
      'Seu pipeline de extração processa cardápios de restaurantes e precisa emitir JSON estruturado com campos para nome do item, descrição, preço e tags alimentares. Alguns cardápios usam formatação inconsistente — preços como "$12" vs "12.00", info alimentar como ícones vs texto. Qual a abordagem mais confiável?',
    options: [
      'Usar chamadas de extração separadas para cada campo para garantir tratamento consistente de cada tipo.',
      'Extrair os dados como estão e normalizar os formatos em código de pós-processamento depois que o Claude retorna.',
      'Solicitar múltiplas tentativas de extração por documento e selecionar o formato mais comum.',
      'Definir um schema de saída estrito e incluir regras de normalização de formato no seu prompt.',
    ],
    explanation:
      'Schema estrito + regras explícitas de normalização ("preços como decimal com duas casas", "alimentar como tags enumeradas") permite ao modelo extrair e normalizar em uma única passada.',
  },
  Q58: {
    prompt:
      'Documentos chegam continuamente durante o horário comercial e precisam ter dados estruturados extraídos. Para reduzir custos, você quer usar a `Message Batches API` (50% de desconto, janela de processamento de até 24 horas). Seu SLA especifica que os resultados da extração devem estar disponíveis em até 30 horas da chegada do documento com 99,9% de confiabilidade. Qual estratégia de batching é mais apropriada?',
    options: [
      'Enviar lotes a cada 6 horas contendo os documentos daquela janela',
      'Enviar um único lote no fim do dia contendo todos os documentos daquele dia',
      'Enviar lotes a cada 4 horas contendo os documentos daquela janela',
      'Usar a API em tempo real para todos os documentos em vez de processamento em lote',
    ],
    explanation:
      'Espera máxima de 4 horas + SLO de lote de até 24 horas = 28 horas no pior caso, deixando 2 horas de folga sob o SLA de 30 horas para absorver a variância do lote e atingir 99,9%.',
  },
  Q59: {
    prompt:
      'Após o deploy, você descobre que 12% das extrações contêm erros semânticos que passam pela validação de schema JSON (ex.: uma duração como "30 minutos" colocada incorretamente em um campo de quantidade de ingrediente). Os revisores humanos têm capacidade de checar apenas 20% das extrações. Qual abordagem aloca a atenção dos revisores de forma mais eficaz?',
    options: [
      'Fazer o modelo emitir escores de confiança por campo e então calibrar os limiares de revisão usando um conjunto de validação rotulado.',
      'Amostrar aleatoriamente 20% das extrações para revisão, usando as correções para rastrear a acurácia e identificar padrões de erro.',
      'Priorizar a revisão de todas as extrações onde campos obrigatórios estão vazios ou explicitamente marcados como não encontrados.',
      'Revisar todas as extrações de documentos com anomalias de formatação, como layouts incomuns ou tipos de conteúdo misturados.',
    ],
    explanation:
      'Confiança por campo permite rotear os 20% de baixa confiança — que é onde os 12% de erros semânticos se concentram — para humanos. A calibração torna a escolha do limiar orientada por dados.',
  },
  Q52: {
    prompt:
      'Seu sistema extrai metadados de eventos (data, local, organizador, `attendee_count`) de artigos de notícias usando um schema JSON com todos os campos anuláveis. Durante a avaliação, você observa que o modelo frequentemente gera valores plausíveis mas incorretos para campos não mencionados no artigo — por exemplo, gerando "500" para `attendee_count` quando a fonte não contém informação de público. Qual a forma mais eficaz de reduzir essas extrações falsas?',
    options: [
      'Adicionar uma etapa de pós-processamento usando uma segunda chamada de LLM para verificar se cada valor extraído existe no documento fonte.',
      'Adicionar instruções no prompt para retornar null em qualquer campo onde a informação não é diretamente declarada na fonte.',
      'Tornar todos os campos do schema obrigatórios (não anuláveis) com regras de validação estritas para garantir que o modelo só emita dados verificáveis.',
      'Migrar para um tier de modelo mais capaz com melhor aderência a instruções para reduzir a tendência de alucinação.',
    ],
    explanation:
      'Os campos já são anuláveis; o modelo só precisa de uma instrução explícita para preferir null a um chute plausível. Essa é a correção padrão para alucinação com schema.',
  },
  Q57: {
    prompt:
      'Seu sistema de extração analisa descrições de produtos de e-commerce para extrair especificações como dimensões, peso e materiais em JSON. Apesar de ter um schema bem definido, o modelo extrai o campo "materials" de forma inconsistente — às vezes retornando "cotton blend", outras "Cotton/Polyester mix", e ocasionalmente omitindo o campo quando a informação de material está claramente presente na fonte. Qual a forma mais eficaz de melhorar a consistência da extração?',
    options: [
      'Tornar o campo "materials" obrigatório em vez de opcional no schema para forçar o modelo a sempre extrair um valor',
      'Migrar para um tier de modelo mais capaz, já que a extração inconsistente indica capacidade insuficiente do modelo',
      'Definir temperature como 0 para eliminar aleatoriedade e garantir saídas determinísticas',
      'Adicionar exemplos few-shot mostrando 2-3 pares completos de entrada-saída com formatos padronizados de descrição de material',
    ],
    explanation:
      'Exemplos few-shot demonstram o formato canônico exato que você quer ("cotton/polyester" como lista normalizada), e também elevam o recall de informação de material que estava sendo pulada.',
  },
  Q46: {
    prompt:
      'Seu sistema de extração processa dois tipos de documento: relatórios mensais padrão (arquivados após o processamento) e relatórios de exceção urgentes (que devem disparar alertas de negócio em até 30 minutos do recebimento). Ambos usam o mesmo schema JSON. Você quer minimizar os custos de API atendendo aos requisitos de latência. Como você deve arquitetar o pipeline de processamento?',
    options: [
      'Enviar todos os documentos para a Messages API em tempo real para garantir latência de processamento consistente entre os tipos de documento.',
      'Enviar todos os documentos para a `Batch API` com `custom_ids` para rastreamento. Quando os resultados chegarem, processar imediatamente os documentos urgentes e disparar alertas atrasados para as exceções.',
      'Enfileirar todos os documentos e enviar lotes de hora em hora, sinalizando os documentos urgentes para tratamento acelerado quando os resultados do lote retornarem.',
      'Rotear os relatórios padrão para a `Batch API` para 50% de economia, e rotear os relatórios de exceção urgentes para a Messages API em tempo real.',
    ],
    explanation:
      'Case o perfil de latência com a urgência do documento: lote para o volume (barato), tempo real para as exceções sensíveis à latência (rápido). Minimiza custo atendendo ao SLA.',
  },
  Q50: {
    prompt:
      'Seu sistema de extração implementa retentativas automáticas quando a validação falha. Em cada retentativa, o erro de validação específico é anexado ao prompt. Essa abordagem de retentativa-com-feedback-de-erro resolve a maioria das falhas em 2-3 tentativas. Para qual padrão de falha as retentativas adicionais seriam MENOS eficazes?',
    options: [
      'O modelo extrai palavras-chave como um objeto aninhado organizado por categoria quando o schema exige um array plano de strings',
      'O modelo extrai contagens de citação como strings formatadas por locale ("1,234") quando o schema exige inteiros',
      'O modelo extrai datas como strings datetime ISO 8601 ("2023-03-15T00:00:00Z") quando o schema exige apenas a parte da data (YYYY-MM-DD)',
      'O modelo extrai "et al." para coautores quando a lista completa existe apenas em um documento externo que não está na entrada',
    ],
    explanation:
      'Nenhuma quantidade de retentativas ensina ao modelo uma informação que não está na entrada. Retentativa-com-feedback-de-erro só corrige erros que o modelo poderia ter acertado a partir da fonte.',
  },
  Q56: {
    prompt:
      'Sua extração usa tool use com um schema JSON onde `property_type` é definido como um enum: [\'house\', \'apartment\', \'condo\', \'townhouse\']. Após o deploy, 8% das extrações falham na validação de schema. A investigação revela que os anúncios mencionam muitos tipos de imóvel incomuns — "studio", "loft", "duplex", "mobile home", "tiny house", "converted warehouse" — e novos tipos continuam aparecendo regularmente. Qual a solução de longo prazo mais eficaz?',
    options: [
      'Expandir continuamente o enum para incluir os tipos de imóvel recém-observados e adicionar monitoramento para casos de borda adicionais.',
      'Adicionar um valor "other" ao seu enum com um campo string `property_type_detail` separado para especificar quando "other" for selecionado.',
      'Mudar `property_type` de enum para uma string livre e implementar uma etapa de normalização no pós-processamento.',
      'Adicionar exemplos few-shot ao seu prompt demonstrando como mapear tipos de imóvel inesperados para o valor de enum existente mais próximo.',
    ],
    explanation:
      'Mantém o enum forte para os casos comuns (joins limpos a jusante) enquanto dá uma saída de escape bem tipada que preserva o detalhe. Estável no longo prazo.',
  },
  Q54: {
    prompt:
      'Seu pipeline de extração processa faturas e extrai itens de linha, subtotais, valores de imposto e totais gerais. Durante a avaliação, você descobre que em 18% das extrações a soma dos valores dos itens de linha extraídos não bate com o total geral extraído — às vezes por erros de OCR no documento fonte, às vezes por erros de extração do modelo. Sistemas contábeis a jusante rejeitam registros com totais divergentes. Qual a abordagem mais eficaz para melhorar a confiabilidade da extração?',
    options: [
      'Adicionar um campo "`calculated_total`" onde o modelo soma os itens de linha extraídos junto a um campo "`stated_total`". Sinalizar registros para revisão humana quando os valores diferirem.',
      'Extrair itens de linha e totais de forma independente, e então usar um modelo de validação separado para reconciliar divergências determinando quais valores extraídos são mais provavelmente corretos.',
      'Adicionar exemplos few-shot demonstrando faturas onde os itens de linha extraídos somam corretamente ao total declarado, incentivando o modelo a produzir extrações matematicamente consistentes.',
      'Implementar pós-processamento que ajusta automaticamente os valores dos itens de linha proporcionalmente quando a soma não bate com o total declarado.',
    ],
    explanation:
      'Capturar ambos os valores torna a divergência um sinal de primeira classe — você pega erros de OCR e de extração de forma uniforme, e pode rotear só os 18% divergentes para humanos.',
  },
  Q47: {
    prompt:
      'Seu schema inclui um campo skills: string[]. O monitoramento de produção revela três problemas de consistência: (1) frases compostas como "Python and SQL" às vezes são mantidas como uma entrada, às vezes divididas; (2) habilidades implícitas mas não declaradas ocasionalmente aparecem nas extrações; (3) documentos similares produzem tamanhos de array muito diferentes (5-10 vs 40+ entradas). Seu prompt atualmente diz "Extraia todas as habilidades mencionadas." Qual a melhoria mais eficaz?',
    options: [
      'Adicionar exemplos few-shot demonstrando o tratamento de frases compostas, critérios de menção explícita e granularidade apropriada de entrada.',
      'Adicionar restrições: "Extraia no máximo 10-20 habilidades, uma habilidade por entrada, apenas habilidades explicitamente nomeadas."',
      'Adicionar normalização pós-extração que mapeia as habilidades para uma taxonomia canônica e deduplica entradas similares.',
      'Enriquecer o schema para {skill: string, confidence: float, `source_quote`: string}[] para capturar metadados de extração.',
    ],
    explanation:
      'Os três problemas são sobre a interpretação do modelo do que conta como "uma habilidade". Exemplos few-shot ensinam o padrão concretamente — dividir vs. não dividir, mencionada vs. inferida, granularidade apropriada.',
  },
  Q48: {
    prompt:
      'Seu sistema opera com 100% de revisão humana há 3 meses. A análise mostra que extrações com confiança do modelo >90% têm 97% de acurácia no geral. Para reduzir a carga dos revisores, você planeja automatizar as extrações de alta confiança. Antes de fazer o deploy, qual etapa de validação é a mais crítica?',
    options: [
      'Analisar a acurácia por tipo de documento e campo para verificar se as extrações de alta confiança têm desempenho consistente em todos os segmentos, não apenas no agregado.',
      'Comparar a acurácia em diferentes limiares de confiança (85%, 90%, 95%) para encontrar o corte ótimo que maximiza a automação minimizando erros.',
      'Rodar um piloto de duas semanas roteando 25% das extrações de alta confiança diretamente para os sistemas a jusante e monitorar os relatórios de erro.',
      'Verificar se 97% de acurácia atende aos requisitos de todos os sistemas a jusante que consomem os dados extraídos.',
    ],
    explanation:
      'A acurácia agregada esconde falhas por segmento — um tipo de documento pode estar em 70% enquanto outros estão em 99%. Automatizar só pelo número geral arrisca erros sistemáticos nos segmentos fracos.',
  },
  Q53: {
    prompt:
      'Após implementar tool use com definições de schema estritas, os erros de sintaxe JSON são eliminados, mas 5% das extrações ainda têm JSON válido com arrays vazios ou valores null para campos obrigatórios como citações e metodologia. A verificação por amostragem revela que os documentos fonte contêm essa informação, mas em formatos variados — citações inline vs. bibliografias, seções de metodologia vs. detalhes embutidos nas introduções. Qual a forma mais eficaz de resolver essas falhas?',
    options: [
      'Implementar lógica de retentativa que reenvia as requisições quando a validação detecta campos obrigatórios vazios.',
      'Construir uma camada de pós-processamento baseada em regex que varre os documentos fonte por padrões de citação e palavras-chave de metodologia, preenchendo os campos vazios quando o modelo falha na extração.',
      'Modificar seu schema para tornar citações e metodologia opcionais, e sinalizar registros incompletos para revisão manual em vez de falhar a validação.',
      'Adicionar exemplos few-shot demonstrando extrações de documentos com estruturas variadas — mostrando como identificar citações em diferentes formatos e localizar detalhes de metodologia em diferentes tipos de seção.',
    ],
    explanation:
      'O modo de falha é o modelo não reconhecer formatos variados. Exemplos concretos ao longo da distribuição de formatos elevam diretamente o recall nos 5%.',
  },
  Q60: {
    prompt:
      'Após seu lote diário de 10.000 documentos ser concluído, 300 documentos (3%) falharam com erros "`context_length_exceeded`". O arquivo de resultados identifica cada falha por `custom_id`. Qual a abordagem mais custo-eficiente para processar essas falhas?',
    options: [
      'Reprocessar o lote inteiro com prompt caching habilitado para reduzir o custo de retentar requisições com system prompts idênticos',
      'Reenviar apenas os 300 documentos que falharam após dividi-los em pedaços menores, e então combinar as extrações parciais',
      'Reenviar o lote inteiro de 10.000 documentos usando um tier de modelo com janela de contexto maior',
      'Aumentar o parâmetro `max_tokens` para os 300 documentos que falharam e reenviá-los em um novo lote',
    ],
    explanation:
      'Direcionado, e ataca a causa real (entrada longa demais). Divida os documentos grandes, extraia por pedaço, e então mescle — mínimo de tokens, corrige o modo de falha específico.',
  },
  Q55: {
    prompt:
      'Seu pipeline usa uma ferramenta chamada `extract_metadata` com um schema JSON para detalhes de artigos. Você também definiu as ferramentas `lookup_citations` e `verify_doi` para enriquecimento. Durante os testes, você nota que quando os usuários incluem pedidos como "extraia os metadados e me diga o quão citado ele é", o Claude às vezes chama `lookup_citations` primeiro, o que falha porque precisa do DOI que `extract_metadata` forneceria. Qual a forma mais eficaz de garantir que a extração estruturada de metadados aconteça primeiro?',
    options: [
      'Definir `tool_choice` como "any" para que o Claude precise usar uma ferramenta, combinado com instruções no system prompt priorizando `extract_metadata`.',
      'Definir `tool_choice` como "auto" e reordenar as definições de ferramentas para que `extract_metadata` apareça primeiro no array de tools, já que o Claude prioriza ferramentas listadas antes.',
      'Definir `tool_choice` como {"type": "tool", "name": "`extract_metadata`"} e processar os pedidos de enriquecimento em turnos subsequentes, após receber os metadados extraídos.',
      'Definir `tool_choice` como {"type": "tool", "name": "`extract_metadata`"} para toda chamada de API no pipeline, garantindo que o Claude sempre extraia metadados antes de qualquer enriquecimento.',
    ],
    explanation:
      '`tool_choice`=ferramenta-específica força deterministicamente `extract_metadata` no primeiro turno. Depois você devolve o controle para "auto" para deixar o modelo usar o enriquecimento de citações/DOI com os metadados no contexto.',
  },
  Q38: {
    prompt:
      'Logs de produção revelam tratamento de erro inconsistente: quando `lookup_order` falha, o agente às vezes retenta 5+ vezes (desperdício quando o ID do pedido não existe), às vezes escalona imediatamente (prematuro para problemas temporários de rede), e às vezes pede esclarecimento ao usuário (inadequado quando o problema é um erro de permissão no backend). A investigação mostra que sua ferramenta MCP retorna respostas de erro uniformes: {"isError": true, "content": [{"type": "text", "text": "Operation failed"}]}. O agente não consegue distinguir entre os tipos de erro. Qual a melhoria mais eficaz?',
    options: [
      'Enriquecer as respostas de erro com metadados estruturados: incluir errorCategory (transient/validation/permission), um booleano isRetryable e uma descrição do que causou a falha.',
      'Criar uma ferramenta MCP `analyze_error` que o agente chama após qualquer falha para determinar a categoria do erro e a ação recomendada.',
      'Implementar lógica de retentativa com backoff exponencial no seu servidor MCP para todos os erros, retornando ao agente apenas após esgotar as retentativas.',
      'Adicionar exemplos few-shot ao system prompt demonstrando como interpretar padrões de mensagem de erro e selecionar respostas apropriadas para cada um.',
    ],
    explanation:
      'Dê ao agente a informação de que ele precisa para tomar a decisão certa: categoria, se é retentável e uma causa legível. Isso substitui o chute por uma política determinística.',
  },
  Q34: {
    prompt:
      'A conformidade exige que reembolsos acima de $500 sejam automaticamente escalonados a um agente humano — essa regra não pode ficar a critério do modelo. Apesar de instruções claras no system prompt, os logs de produção mostram que o agente ocasionalmente processa reembolsos de alto valor diretamente (3% de falha). Como você deve garantir a conformidade?',
    options: [
      'Modificar a ferramenta de reembolso para retornar um erro com a mensagem "Valor excede o limite da política — favor escalonar" quando o limiar for excedido.',
      'Adicionar exemplos few-shot ao prompt mostrando o comportamento correto de escalonamento em vários valores de reembolso ($400, $500, $600).',
      'Implementar um hook para interceptar as chamadas de ferramenta; quando o valor do reembolso exceder $500, bloqueá-lo e invocar o escalonamento humano.',
      'Reforçar o system prompt com linguagem enfática: "POLÍTICA CRÍTICA: Reembolsos acima de $500 DEVEM disparar escalonamento humano. NUNCA processe estes diretamente."',
    ],
    explanation:
      'Regras de nível de conformidade pertencem fora do modelo — um hook determinístico na chamada da ferramenta é garantido de disparar toda vez, independente do comportamento do modelo.',
  },
  Q37: {
    prompt:
      'O agente verifica a identidade do cliente por um processo de múltiplas etapas antes de redefinir senhas. Durante os testes, você nota que depois que o cliente responde a terceira pergunta de verificação, o agente pede o nome dele novamente, como se a troca anterior nunca tivesse acontecido. Qual a causa mais provável desse comportamento?',
    options: [
      'A ferramenta de verificação está limpando o estado interno do agente após cada etapa de validação bem-sucedida.',
      'O prompt não tem instruções dizendo ao Claude para lembrar informações ao longo de múltiplas trocas.',
      'O histórico da conversa não está sendo passado nas requisições de API subsequentes.',
      'A retenção de memória do Claude é limitada a dois turnos de conversa por padrão, exigindo configuração explícita para estendê-la.',
    ],
    explanation:
      'A API é stateless. Cada requisição deve incluir o array completo de messages. Se você só envia o último turno, o modelo não tem memória dos anteriores — exatamente o sintoma de "pedir o nome de novo".',
  },
  Q43: {
    prompt:
      'Ao implementar sua ferramenta MCP `lookup_order`, o backend às vezes retorna erros (ex.: "Pedido não encontrado" ou falhas temporárias de banco de dados). Qual o padrão correto para comunicar esses erros de volta ao agente?',
    options: [
      'Logar o erro no servidor e retornar um resultado vazio para evitar confundir o modelo',
      'Retornar a mensagem de erro no content do resultado da ferramenta com a flag isError definida como true',
      'Lançar uma exceção do handler da ferramenta para que o framework do agente possa capturar e logar',
      'Retornar uma resposta de sucesso com um campo "status" indicando o tipo de erro',
    ],
    explanation:
      'O padrão do MCP: coloque o texto do erro no campo content e marque isError=true. O Claude vê tanto a flag de falha quanto uma mensagem legível para raciocinar.',
  },
  Q44: {
    prompt:
      'Sua ferramenta `process_refund` retorna dois tipos de erro: erros técnicos ("503 Service Unavailable", "Connection timeout") que são transitórios (5% das chamadas), e erros de negócio ("Pedido excede a janela de devolução de 30 dias", "Item já reembolsado") que são permanentes (12% das chamadas). O monitoramento mostra que o agente desperdiça 3-4 turnos retentando erros de negócio que nunca vão ter sucesso. Atualmente, ambos os tipos de erro retornam apenas uma mensagem de texto simples ao Claude. Qual a forma mais eficaz de reduzir as retentativas desperdiçadas e ao mesmo tempo melhorar a qualidade da resposta ao cliente?',
    options: [
      'Retornar respostas de erro estruturadas com retryable: false para os erros de negócio e uma explicação amigável ao cliente para o Claude usar.',
      'Adicionar exemplos few-shot mostrando como distinguir erros retentáveis dos não-retentáveis analisando o texto da mensagem de erro.',
      'Adicionar uma ferramenta `check_refund_eligibility` que deve ser chamada antes de `process_refund` para prevenir violações de regra de negócio.',
      'Implementar lógica de retentativa automática no nível da ferramenta apenas para os erros técnicos, passando os erros de negócio ao Claude sem retentativas.',
    ],
    explanation:
      'Uma flag retryable diz ao Claude deterministicamente "não retente", e uma mensagem amigável pronta melhora a resposta ao cliente. Resolve os dois problemas de uma vez.',
  },
  Q41: {
    prompt:
      'Seu agente está tratando uma disputa de cobrança. Após chamar `get_customer` e `lookup_order`, ele identifica que a disputa envolve um erro de precificação promocional que exige aprovação de gerente — acima do nível de autorização do agente. Como o fluxo deve lidar com esse escalonamento no meio do processo?',
    options: [
      'Chamar `escalate_to_human` passando apenas a mensagem original do cliente.',
      'Compilar um handoff estruturado com os dados do cliente, informações do pedido e o problema identificado antes de chamar `escalate_to_human`.',
      'Tentar o reembolso com `process_refund` mesmo assim, escalonando apenas se o sistema rejeitar a transação.',
      'Persistir todo o histórico da conversa e das respostas de ferramenta em um banco de dados, e então chamar `escalate_to_human` com um ID de referência.',
    ],
    explanation:
      'Um resumo estruturado (quem, qual pedido, qual problema, por que excede a autorização) permite que o agente humano assuma na hora. Esse é o padrão de escalonamento no meio do processo.',
  },
  Q40: {
    prompt:
      'Um cliente envia: "Isso é frustrante. Eu já expliquei meu problema duas vezes e nada é resolvido. Quero falar com uma pessoa de verdade AGORA." O agente ainda não chamou nenhuma ferramenta para investigar a conta. O que o agente deve fazer?',
    options: [
      'Reconhecer a frustração e fazer uma pergunta direcionada para entender o problema específico antes de escalonar.',
      'Explicar brevemente com o que o agente pode ajudar e se oferecer para resolver o problema rapidamente, escalonando apenas se o cliente repetir o pedido.',
      'Chamar `escalate_to_human` imediatamente com o histórico da conversa.',
      'Primeiro chamar `get_customer` e `lookup_order` para reunir o contexto da conta, e então escalonar para um agente humano.',
    ],
    explanation:
      'O cliente disse "duas vezes" mas você ainda não tem contexto. Uma pergunta focada e acolhedora dá uma chance de resolução no primeiro contato sem descartar a frustração nem atrasar um possível handoff.',
  },
  Q35: {
    prompt:
      'Durante a resolução de uma disputa de cobrança, seu agente recupera com sucesso as informações do cliente via `get_customer` e os detalhes do pedido via `lookup_order`, mas ao tentar chamar `process_refund`, a ferramenta retorna um erro de timeout. O agente tem informação suficiente para explicar as cobranças e verificar a elegibilidade do reembolso, mas não consegue de fato processar o reembolso devido à falha do backend. Qual abordagem melhor equilibra a resolução no primeiro contato com o tratamento de erro apropriado?',
    options: [
      'Escalonar imediatamente para um agente humano, já que a ação de reembolso não pode ser concluída',
      'Implementar retentativas automáticas com backoff exponencial para `process_refund`, mantendo a conversa aberta até o reembolso ser processado com sucesso',
      'Explicar a cobrança, confirmar a elegibilidade do reembolso, reconhecer o problema no sistema que impede o processamento imediato, e oferecer escalonamento ou nova tentativa mais tarde',
      'Confirmar que o reembolso será processado e encerrar a conversa, já que o sistema tem toda a informação necessária para completá-lo automaticamente',
    ],
    explanation:
      'Entregue o valor parcial que você consegue (explicação + elegibilidade), seja honesto sobre a falha, e deixe o cliente escolher entre escalonamento humano ou nova tentativa. Degradação graciosa clássica.',
  },
  Q33: {
    prompt:
      'Após investigar uma disputa de cobrança por mais de 25 turnos, você identificou que cobranças duplicadas ocorreram porque um timeout do gateway de pagamento disparou a lógica de retentativa. O reembolso necessário ($847) excede seu limite de autorização de $500. Você precisa chamar `escalate_to_human`, e o agente humano não terá acesso à transcrição da sua conversa. Que contexto você deve passar para permitir uma resolução eficaz?',
    options: [
      'A reclamação original do cliente na íntegra mais os trechos de resultado das ferramentas mostrando as transações duplicadas.',
      'Um resumo estruturado: ID do cliente, causa raiz, valor do reembolso e ação recomendada.',
      'A transcrição completa da conversa com todos os resultados de ferramenta.',
      'Apenas seu diagnóstico e o valor do reembolso.',
    ],
    explanation:
      'Um handoff estruturado com identificadores, causa, valor e ação recomendada é o que um agente humano precisa para assumir o caso na hora, sem reinvestigar.',
  },
  Q31: {
    prompt:
      'Um cliente volta 4 horas após a sessão inicial sobre a mesma disputa de cobrança. A sessão anterior de 32 turnos contém resultados de `lookup_order` mostrando "Status: PENDING, Resolução esperada: 24-48 horas". Nos testes, você observa que ao retomar sessões com resultados de ferramenta desatualizados, o agente frequentemente referencia os dados velhos nas respostas (ex.: "Vejo que seu reembolso ainda está sendo processado") mesmo depois de chamadas de ferramenta novas retornarem informação diferente. Qual abordagem lida de forma mais confiável com clientes que retornam?',
    options: [
      'Retomar com o histórico completo mas filtrar as mensagens `tool_result` anteriores antes de retomar, mantendo apenas os turnos human/assistant para que o agente precise buscar os dados de novo.',
      'Iniciar uma nova sessão, injetar um resumo estruturado da interação anterior (tipo de problema, ações tomadas, status de resolução), e então fazer chamadas de ferramenta novas antes de engajar.',
      'Retomar com o histórico completo e adicionar uma instrução no system prompt dizendo ao agente para sempre preferir os resultados de ferramenta mais recentes quando houver múltiplas chamadas da mesma ferramenta no contexto.',
      'Retomar com o histórico completo e configurar o agente para automaticamente re-chamar todas as ferramentas usadas anteriormente no início da sessão para garantir a atualidade dos dados.',
    ],
    explanation:
      'Uma sessão limpa com um resumo mantém a continuidade narrativa enquanto garante que o agente não esteja raciocinando sobre resultados de ferramenta desatualizados.',
  },
  Q42: {
    prompt:
      'Um cliente levanta três problemas separados durante uma sessão: uma consulta de reembolso (turnos 1-15), uma pergunta sobre assinatura (turnos 16-30) e uma atualização de método de pagamento (turnos 31-45). No turno 48, o cliente pergunta "O que aconteceu com meu reembolso?" A conversa está se aproximando dos limites de contexto. Qual estratégia melhor mantém a capacidade do agente de tratar todos os problemas ao longo da sessão?',
    options: [
      'Extrair e persistir dados estruturados dos problemas (IDs de pedido, valores, status) em uma camada de contexto separada.',
      'Confiar nas ferramentas MCP para buscar novamente a informação relevante sob demanda quando o cliente referenciar problemas anteriores.',
      'Resumir os turnos anteriores em uma descrição narrativa, preservando o histórico completo de mensagens apenas para o problema ativo.',
      'Implementar contexto de janela deslizante que retém os 30 turnos mais recentes.',
    ],
    explanation:
      'A sumarização progressiva comprime os tópicos resolvidos e estáveis mantendo o fio ativo na íntegra — o padrão clássico para conversas longas com múltiplos problemas perto do limite de contexto.',
  },
  Q39: {
    prompt:
      'Quando o agente chama `lookup_order` e recebe os detalhes do pedido mostrando que o item foi comprado há 45 dias, como o loop agentico determina se deve chamar `process_refund` ou `escalate_to_human` em seguida?',
    options: [
      'A camada de orquestração roteia automaticamente para a próxima ferramenta com base no campo de status do pedido.',
      'O agente segue uma árvore de decisão pré-configurada que mapeia atributos do pedido para chamadas de ferramenta específicas.',
      'Os detalhes do pedido são adicionados à conversa e o modelo raciocina sobre qual ação tomar.',
      'O agente executa os passos restantes em uma sequência de ferramentas planejada no início da requisição.',
    ],
    explanation:
      'O loop agentico funciona anexando mensagens `tool_result` à conversa e deixando o modelo decidir o próximo passo a cada turno. É assim que "45 dias → reembolsar vs. escalonar" é resolvido.',
  },
  Q32: {
    prompt:
      'Você está implementando a lógica de escalonamento para quando o agente deve chamar `escalate_to_human`. Sua equipe propõe quatro abordagens diferentes para disparar o escalonamento. Qual abordagem identifica de forma mais confiável os casos que genuinamente exigem intervenção humana?',
    options: [
      'Instruir o agente a escalonar quando o cliente pedir um humano, quando o problema exigir exceções de política, ou quando o agente não conseguir fazer progresso significativo.',
      'Configurar o agente para escalonar após três chamadas de ferramenta consecutivas que falham em resolver o problema declarado do cliente, garantindo uma tentativa razoável antes de envolver um humano.',
      'Implementar análise de sentimento que monitora indicadores de frustração (linguagem negativa, perguntas repetidas, pontos de exclamação) e disparar o escalonamento quando o escore de frustração exceder um limiar configurado.',
      'Construir um motor de regras que mapeia tipos específicos de problema, segmentos de cliente e categorias de produto para decisões de escalonamento, removendo a necessidade de julgamento do modelo.',
    ],
    explanation:
      'Decisões de escalonamento são julgamentos sobre intenção e progresso — exatamente onde LLMs são bons. Critérios claros em linguagem natural superam regras rígidas para a cauda longa.',
  },
  Q45: {
    prompt:
      'Seu agente chamou `lookup_order` várias vezes ao investigar os pedidos de devolução de um cliente. Cada resposta inclui 40+ campos (itens, detalhes de envio, info de pagamento, histórico de status). As saídas de ferramenta agora representam a maioria do contexto da conversa. O cliente menciona mais dois pedidos que quer discutir. Qual a abordagem mais eficaz antes de fazer mais consultas?',
    options: [
      'Extrair apenas os campos relevantes para devolução (itens, data de compra, janela de devolução, status) de cada resposta de pedido existente, removendo os detalhes verbosos',
      'Fazer o modelo gerar um resumo em linguagem natural dos detalhes-chave de cada pedido, substituindo as respostas estruturadas por descrições em prosa',
      'Mover todas as respostas de ferramenta para um banco de dados vetorial com indexação semântica, recuperando as porções relevantes conforme a conversa continua',
      'Prosseguir com as consultas adicionais sem modificar o contexto de saída de ferramenta existente',
    ],
    explanation:
      'Mantenha os campos que importam para a tarefa e descarte o resto. Isso ataca diretamente o problema de inchaço de contexto antes de você adicionar mais duas consultas.',
  },
  Q36: {
    prompt:
      'Um cliente escreve: "Estou indo e voltando nessa devolução há dias. Só quero falar com alguém que possa realmente me ajudar." O agente confirmou via `lookup_order` que a devolução é simples — dentro da política e elegível para processamento imediato. O que o agente deve fazer?',
    options: [
      'Reconhecer a frustração, informar que isso é resolvível agora, e oferecer completar a devolução ou escalonar',
      'Chamar `escalate_to_human` imediatamente para honrar o pedido do cliente',
      'Processar o reembolso via `process_refund` para resolver o problema subjacente, e então informar que está concluído',
      'Perguntar o que especificamente não funcionou nas tentativas anteriores antes de decidir se escalona ou resolve automaticamente',
    ],
    explanation:
      'Honre o sentimento, dê o caminho rápido de resolução por escrito, e preserve a escolha do cliente. Essa é a atitude de respeito ao cliente que ainda aproveita a capacidade do agente.',
  },
  Q26: {
    prompt:
      'O subagente de exploração de um engenheiro passou 30 minutos analisando um sistema de pagamentos legado, lendo 47 arquivos e documentando fluxos de dados. A sessão foi interrompida quando a conexão do engenheiro caiu. Enquanto ele estava ausente, um colega mesclou um PR que renomeou duas funções utilitárias. O engenheiro quer continuar a mesma exploração. Qual a abordagem mais eficaz?',
    options: [
      'Retomar o subagente do transcript anterior sem mencionar as mudanças — o entendimento da arquitetura permanece válido.',
      'Iniciar um subagente novo e incluir o transcript anterior no prompt inicial como contexto.',
      'Iniciar um subagente novo com um resumo dos achados anteriores.',
      'Retomar o subagente do transcript anterior e informá-lo sobre as funções renomeadas.',
    ],
    explanation:
      'Mantenha o entendimento acumulado e dê a ele um delta direcionado sobre as renomeações para que atualize seu modelo mental — mínimo de desperdício, máxima precisão.',
  },
  Q28: {
    prompt:
      'Seu agente analisou um módulo de serviço complexo — lendo 23 arquivos-fonte, rastreando fluxos de requisição e identificando padrões de tratamento de erro. Um desenvolvedor quer comparar duas estratégias de teste antes de escolher uma: testes end-to-end com serviços externos mockados vs. testes de snapshot capturando as saídas esperadas. Ele precisa desenvolver ambas as abordagens de forma independente para avaliar os trade-offs. Como você deve gerenciar as sessões?',
    options: [
      'Exportar os achados-chave da sessão de análise para um arquivo, e então criar duas novas sessões que referenciam esse arquivo.',
      'Retomar a sessão de análise com `fork_session` habilitado, criando um branch separado para cada estratégia de teste.',
      'Iniciar duas sessões novas, fazendo cada uma reler os arquivos-fonte relevantes antes de começar.',
      'Continuar na sessão original, desenvolvendo primeiro os testes end-to-end e depois os testes de snapshot sequencialmente.',
    ],
    explanation:
      'O fork dá a cada estratégia seu próprio contexto independente, partindo exatamente da baseline da análise — sem contaminação cruzada, sem reanálise.',
  },
  Q30: {
    prompt:
      'Um engenheiro que acabou de entrar no time pede ao agente para ajudá-lo a entender a arquitetura de autenticação e autorização antes de fazer melhorias de segurança. O codebase tem 800+ arquivos em múltiplos serviços. Qual estratégia de exploração construirá o entendimento de forma mais eficaz, dadas as ferramentas nativas do Claude e os limites de contexto?',
    options: [
      'Ler primeiro quaisquer arquivos CLAUDE.md e README, e então pedir ao engenheiro para especificar quais 10-15 arquivos são mais importantes para entender o sistema de auth.',
      'Iniciar subagentes em paralelo para explorar serviços diferentes simultaneamente, e então sintetizar seus achados em uma visão arquitetural.',
      'Usar Grep para encontrar os pontos de entrada de autenticação, ler esses arquivos, e então seguir os imports e chamadas de função para mapear o fluxo de auth incrementalmente.',
      'Ler todos os arquivos que contêm "auth", "login", "permission" ou "token" no conteúdo ou no nome do arquivo.',
    ],
    explanation:
      'Comece pelos pontos de entrada (login, verificação de token, middleware), e então trace para fora seguindo as arestas reais do código. Incremental, ancorado, e cabe nos limites de contexto.',
  },
  Q27: {
    prompt:
      'Após adicionar um servidor MCP com ferramentas especializadas de refatoração de código (`extract_function`, `rename_variable`, `inline_function`), você nota que o agente ainda usa manipulação básica de texto via Write e comandos sed do Bash para tarefas de refatoração. O servidor MCP está conectado e saudável. Examinando a configuração, você descobre que cada ferramenta MCP tem uma descrição mínima como "`extract_function`: extrai uma função do código." Qual a forma mais eficaz de melhorar a adoção das ferramentas MCP de refatoração?',
    options: [
      'Implementar um classificador de requisição que detecta intenção de refatoração e roteia automaticamente essas requisições para o servidor MCP antes do agente processá-las.',
      'Remover a ferramenta Write da configuração do agente nas sessões de refatoração para que ele precise usar as ferramentas MCP nas modificações de código.',
      'Aceitar isso como comportamento esperado, já que ferramentas mais simples como sed são mais previsíveis que ferramentas de refatoração especializadas.',
      'Melhorar as descrições das ferramentas MCP para explicar quando cada ferramenta é preferível à manipulação de texto e esclarecer as entradas e saídas esperadas.',
    ],
    explanation:
      'A seleção de ferramentas é guiada pelas descrições que o Claude vê. Quando as ferramentas MCP dizem "extrai uma função do código" e Write/sed vêm com documentação rica, o Claude escolhe Write/sed. Reforce as descrições.',
  },
  Q20: {
    prompt:
      'Seu agente passou 25 minutos explorando o subsistema de renderização de um game engine — lendo código de shader, gerenciamento de buffer e lógica de sincronização de frames. Um engenheiro agora pede que ele entenda como o motor de física se integra à renderização para overlays de debug de colisão. Você nota que respostas recentes referenciam "padrões típicos de renderização" em vez das classes específicas VulkanPipeline e FrameGraph que ele descobriu antes. Qual a abordagem mais eficaz?',
    options: [
      'Criar um subagente para explorar a física independentemente, e então sintetizar manualmente seus achados com o conhecimento de renderização acumulado na conversa principal.',
      'Continuar no contexto atual com prompts mais direcionados referenciando as classes específicas pelo nome.',
      'Resumir os achados-chave de renderização, e então criar um subagente para a exploração da física com esse resumo em seu contexto inicial.',
      'Usar /clear para resetar o contexto completamente, e então começar do zero com a exploração da física usando os caminhos de arquivo do CLAUDE.md do projeto.',
    ],
    explanation:
      'Condense o que você aprendeu sobre renderização em um resumo compacto, e então dê a um subagente novo esse resumo mais a tarefa de física — você preserva o sinal importante e escapa do contexto degradado.',
  },
  Q22: {
    prompt:
      'Um engenheiro usou o agente ontem para analisar um módulo de autenticação legado, identificando duas abordagens distintas de refatoração: extrair um microsserviço versus refatorar no lugar. Hoje, ele quer explorar ambas as abordagens em profundidade — fazendo o agente propor mudanças de código específicas para cada uma — antes de decidir qual implementar. Qual a forma mais eficaz de estruturar essa exploração?',
    options: [
      'Retomar a sessão de ontem para explorar a primeira abordagem, e então iniciar uma nova sessão para a segunda, recriando manualmente o contexto original.',
      'Iniciar duas sessões novas, fornecendo manualmente um resumo dos achados da análise de ontem para estabelecer o contexto.',
      'Retomar a sessão de ontem e explorar ambas as abordagens sequencialmente dentro do mesmo fio de conversa.',
      'Usar `fork_session` para criar dois branches a partir da análise de ontem, explorando uma abordagem em cada fork.',
    ],
    explanation:
      'Fazer o fork da sessão de ontem dá a cada abordagem seu próprio contexto independente, partindo da mesma baseline de análise — limpo, paralelo, sem contaminação.',
  },
  Q29: {
    prompt:
      'Seu agente precisa inserir uma nova função auxiliar no meio de um módulo utilitário de 150 linhas, entre duas funções existentes. A ferramenta Edit falha porque seu parâmetro `old_string` não consegue encontrar um texto único para casar — o arquivo tem docstrings, nomes de variáveis e padrões estruturais repetitivos. Qual a forma mais confiável de completar essa inserção?',
    options: [
      'Usar Edit com um `old_string` extremamente longo capturando 30+ linhas de contexto para garantir unicidade',
      'Usar o parâmetro `replace_all` do Edit para mirar um padrão comum e embutir a nova função no texto de substituição',
      'Usar Bash para anexar a definição da função ao fim do arquivo usando sintaxe heredoc',
      'Usar Read para carregar o arquivo, adicionar a função no local apropriado, e então Write o arquivo atualizado',
    ],
    explanation:
      'Quando o contrato de correspondência única do Edit não pode ser satisfeito em um arquivo repetitivo, recorra a Read → modificar em memória na linha pretendida → Write o arquivo completo de volta.',
  },
  Q23: {
    prompt:
      'Um engenheiro pede ao agente para entender como a camada de cache funciona antes de adicionar um novo gatilho de invalidação de cache. Após buscas iniciais com Grep, o agente identificou que a lógica de cache se espalha por 15 arquivos incluindo decorators, middleware e classes de serviço (~8.000 linhas no total). Qual o próximo passo mais eficaz para construir o entendimento gerenciando as restrições de contexto?',
    options: [
      'Usar a ferramenta Read para carregar sequencialmente todos os 15 arquivos, construindo entendimento completo de toda a implementação de cache.',
      'Analisar os imports e hierarquias de classe para identificar a classe base de cache, ler esse arquivo para entender a interface, e então rastrear as implementações específicas de invalidação.',
      'Usar Grep para buscar os padrões "invalidate" e "expire" em todos os arquivos, e então ler apenas esses intervalos de linha específicos com contexto mínimo ao redor.',
      'Usar Glob para encontrar arquivos que casam com padrões comuns de cache (cache.py, caching/), priorizar os maiores lendo-os primeiro, e então checar os menores por lacunas.',
    ],
    explanation:
      'Comece pela raiz arquitetural (a interface), e então navegue só pelas implementações específicas que importam para a invalidação — leitura focada, baixo custo de contexto.',
  },
  Q18: {
    prompt:
      'Durante os testes, você observa que em sessões de exploração estendidas (30+ minutos), o agente começa a dar respostas inconsistentes sobre a estrutura de código que discutiu antes. Os engenheiros relatam ter que repetir contexto sobre módulos que já exploraram. Qual a abordagem mais eficaz para resolver isso?',
    options: [
      'Fazer o agente manter um arquivo de rascunho (scratchpad) que registra os achados-chave, referenciando-o para as perguntas subsequentes.',
      'Mudar para um tier de modelo de maior capacidade para prover mais espaço de janela de contexto para os dados de exploração acumulados.',
      'Implementar limpeza automática de contexto a cada 15 minutos para garantir que o agente comece com contexto novo e não contaminado.',
      'Criar resumos de todos os arquivos-fonte antes de a exploração começar, carregando apenas essas representações comprimidas no contexto.',
    ],
    explanation:
      'Um scratchpad descarrega os achados para um armazenamento durável que o agente pode reler sob demanda, dando a ele uma "memória" estável independente de quão cheia a janela de contexto fica.',
  },
  Q25: {
    prompt:
      'Um desenvolvedor pede ao agente para investigar por que um endpoint de API específico retorna erros 500 intermitentemente. O codebase tem 200+ arquivos e o desenvolvedor não sabe quais componentes estão envolvidos. O agente precisa rastrear o erro por roteamento, middleware, lógica de negócio e camadas de banco de dados. Qual abordagem de decomposição de tarefa seria mais eficaz?',
    options: [
      'Fazer o agente primeiro criar um plano abrangente mapeando todos os caminhos de código pelo endpoint antes de começar qualquer exploração de arquivo ou leitura de código.',
      'Fazer o agente gerar dinamicamente subtarefas de investigação com base no que ele descobre a cada passo, adaptando seu plano de exploração conforme novas informações sobre o caminho do erro surgem.',
      'Definir uma sequência fixa de passos de investigação de antemão — grep por padrões de erro, depois ler handlers de erro, depois checar queries de banco, depois examinar middleware — executando cada passo independentemente dos achados intermediários.',
      'Rodar agentes trabalhadores em paralelo que investigam simultaneamente as quatro camadas, e então sintetizar seus achados para identificar de onde o erro se origina.',
    ],
    explanation:
      'Depuração é adaptativa por natureza — cada arquivo que você lê muda qual é o próximo passo mais útil. Deixe o agente seguir as evidências.',
  },
  Q16: {
    prompt:
      'Após integrar um servidor MCP local que fornece ferramentas de análise de código (`analyze_dependencies`, `find_dead_code`, `calculate_complexity`), você verifica que o servidor está saudável e as ferramentas aparecem na resposta tools/list. Porém, você observa que o agente consistentemente usa Grep para buscar declarações de import em vez de chamar `analyze_dependencies` — mesmo quando os usuários perguntam explicitamente sobre "dependências de código". Examinando as definições de ferramenta, você vê: MCP: `analyze_dependencies` - "Analisa o grafo de dependências" Nativa: Grep - "Busca conteúdo de arquivos por um padrão usando expressões regulares. Retorna linhas correspondentes com números de linha e contexto ao redor." Qual a abordagem mais eficaz para melhorar a seleção das ferramentas MCP pelo agente?',
    options: [
      'Remover o Grep das ferramentas disponíveis quando o servidor MCP estiver conectado para eliminar a sobreposição funcional.',
      'Adicionar instruções de roteamento ao system prompt especificando que perguntas relacionadas a dependências devem usar ferramentas MCP em vez de Grep.',
      'Dividir `analyze_dependencies` em ferramentas granulares (`list_imports`, `resolve_transitive_deps`, `detect_circular_deps`) para que cada uma tenha um propósito focado, menos propenso a sobrepor com o Grep.',
      'Expandir as descrições das ferramentas MCP para detalhar capacidades e saídas — ex.: "Constrói o grafo de dependências mostrando imports diretos, dependências transitivas e ciclos."',
    ],
    explanation:
      'A seleção de ferramentas é guiada pelas descrições que o modelo vê. Uma descrição de uma linha como "Analisa o grafo de dependências" perde para a descrição rica do Grep. Reforce a descrição da ferramenta MCP.',
  },
  Q17: {
    prompt:
      'Um engenheiro pede ao agente para encontrar todos os chamadores de uma função antes de removê-la. A função é definida em uma biblioteca central mas também é exposta por módulos wrapper que renomeiam a função para uso específico de domínio (ex.: calculateTax na biblioteca vira computeOrderTax no módulo de pedidos). Qual estratégia de exploração identificará de forma mais confiável todos os chamadores?',
    options: [
      'Ler a biblioteca e os módulos wrapper para identificar todos os nomes expostos da função, e então dar Grep em cada nome pelo codebase.',
      'Usar Grep para encontrar todos os arquivos que importam da biblioteca ou dos módulos wrapper, e então ler cada arquivo para checar se ele usa a função.',
      'Usar Grep para buscar o nome original da função pelo codebase.',
      'Buscar o nome da função na documentação do projeto para entender os padrões de uso pretendidos e navegar até os pontos de integração documentados.',
    ],
    explanation:
      'Você precisa enumerar todo nome sob o qual a função é exposta — senão wrappers renomeados escondem chamadores. Leia os módulos relevantes, reúna todos os aliases, e então dê grep em cada um.',
  },
  Q19: {
    prompt:
      'Uma engenheira usou o `Claude Code` ontem para investigar fluxos de autenticação em um monólito legado, construindo um contexto significativo ao longo de uma sessão de 2 horas. Hoje ela quer continuar essa investigação específica. Ela trabalhou em três outros codebases desde então e sabe que a sessão se chamava "auth-deep-dive". Como ela deve retomar?',
    options: [
      'Começar do zero e reler os mesmos arquivos',
      'Usar `--session-id` com o UUID do arquivo de transcript da sessão de ontem',
      'Usar `--continue` para pegar de onde a conversa mais recente parou',
      'Usar `--resume` auth-deep-dive para carregar aquela sessão específica pelo nome',
    ],
    explanation:
      '`--resume` com o nome da sessão foi feito exatamente para isso: escolher uma sessão anterior específica dentre muitas, pelo nome que você deu.',
  },
  Q24: {
    prompt:
      'Um engenheiro pede ao seu agente para identificar caminhos de código não testados em um módulo legado de processamento de pagamentos que abrange 45 arquivos. Após ler os primeiros 8 arquivos-fonte, as respostas do agente estão ficando visivelmente menos precisas — ele esquece padrões de código discutidos antes e ainda não localizou todos os arquivos de teste nem rastreou os fluxos críticos de pagamento. Qual a abordagem mais eficaz para completar essa investigação?',
    options: [
      'Documentar todos os achados atuais em um relatório-resumo, limpar o contexto completamente, e então usar esse relatório como única referência para continuar a investigação.',
      'Criar subagentes para investigar perguntas específicas (ex.: "encontre todos os arquivos de teste para processamento de pagamentos", "rastreie as dependências do fluxo de reembolso") enquanto o agente principal coordena os achados e preserva o entendimento de alto nível.',
      'Limpar o contexto com /clear, e então reler seletivamente apenas os arquivos mais críticos descobertos até agora, escrevendo os achados-chave em um arquivo scratchpad que persiste entre os resets de contexto.',
      'Mudar para usar Grep para buscar nomes de função específicos em vez de ler arquivos inteiros, reduzindo o conteúdo carregado no contexto para a exploração restante.',
    ],
    explanation:
      'Delegue investigações bem escopadas a subagentes com contexto novo, enquanto o agente principal mantém a visão arquitetural. Esse é o padrão para escalar a exploração além de uma única janela de contexto.',
  },
  Q21: {
    prompt:
      'Sua ferramenta de exploração de codebase armazena IDs de sessão para permitir que engenheiros continuem investigações entre sessões de trabalho. Um engenheiro passou uma hora ontem analisando um módulo de autenticação legado, construindo contexto sobre sua arquitetura e dependências. Ele quer continuar hoje. O ID da sessão é válido, mas o controle de versão mostra que 3 dos 12 arquivos que o agente leu anteriormente foram modificados durante a noite pelo merge de um colega. Qual abordagem melhor equilibra eficiência e precisão?',
    options: [
      'Retomar a sessão sem informar o agente sobre os arquivos alterados',
      'Iniciar uma sessão nova para garantir que o agente trabalhe com o estado atual do codebase sem suposições desatualizadas',
      'Retomar a sessão e informar ao agente quais arquivos específicos mudaram para reanálise direcionada',
      'Retomar a sessão e imediatamente fazer o agente reler todos os 12 arquivos analisados anteriormente',
    ],
    explanation:
      'Mantém o contexto caro que você já construiu, ao mesmo tempo que diz ao agente exatamente quais 3 arquivos reler — mínimo de desperdício, máxima precisão.',
  },
  Q61: {
    prompt:
      'Você está implementando o loop agêntico de um coordenador de pesquisa chamando a Messages API diretamente, sem um framework que gerencie o ciclo de turnos por você. Você envia o pedido do usuário mais suas definições de ferramentas, e a resposta do Claude volta com `stop_reason: "tool_use"` e um único bloco `tool_use` solicitando a ferramenta `web_search` com uma query específica. Seu código atualmente só retorna o texto do Claude para quem chamou e para.\nO que o seu loop precisa fazer em seguida para continuar corretamente?',
    options: [
      'Tratar `tool_use` como fim do turno e retornar o texto do Claude ao usuário, já que o modelo terminou de raciocinar.',
      'Executar a ferramenta solicitada e então enviar uma nova requisição com todas as mensagens anteriores mais um bloco `tool_result` correspondente ao id do `tool_use`.',
      'Reenviar a requisição idêntica sem mudanças; o modelo vai tentar a chamada de ferramenta sozinho na segunda passada.',
      'Aumentar `max_tokens` e reenviar, porque `tool_use` indica que a resposta foi truncada antes de terminar.',
    ],
    explanation:
      '`stop_reason: tool_use` significa que o Claude pausou para chamar uma ferramenta. Você roda a ferramenta e anexa um `tool_result` (com o `tool_use_id` correspondente) às mensagens, depois chama a API de novo para o modelo continuar.',
  },
  Q62: {
    prompt:
      'Você está construindo uma integração headless com o Claude que roda sem supervisão em um job de backend, e precisa ramificar seu fluxo de controle com base no campo `stop_reason` retornado em toda resposta da Messages API, para o job saber se terminou, se precisa continuar ou se deve rodar uma ferramenta. Um colega escreveu a lógica de ramificação de cabeça e você está revisando.\nQual interpretação dos valores de stop_reason está correta?',
    options: [
      '`end_turn` significa que o usuário precisa responder; `stop_sequence` significa que ocorreu um erro; `tool_use` significa que uma ferramenta falhou.',
      'Todos os valores diferentes de `end_turn` indicam erros que devem abortar o loop.',
      '`end_turn` significa que o Claude terminou naturalmente; `max_tokens` significa que a saída foi cortada pelo limite de tokens; `tool_use` significa que o Claude está solicitando uma chamada de ferramenta.',
      '`max_tokens` significa que a conversa excedeu a janela de contexto e precisa ser resumida antes de continuar.',
    ],
    explanation:
      'Cada stop_reason sinaliza por que a geração parou: end_turn = conclusão natural, max_tokens = atingiu o teto de saída (talvez precise continuar), tool_use = uma ferramenta foi solicitada. Cada um leva a um comportamento diferente do loop.',
  },
  Q63: {
    prompt:
      'Seu coordenador de pesquisa orquestra dois subagentes especializados. O subagente de busca web roda primeiro e retorna oito fontes relevantes, que aparecem na própria conversa do coordenador. O coordenador então cria um subagente de análise de documentos para examinar essas fontes, mas ele responde que não tem fontes para analisar — mesmo que, do ponto de vista do coordenador, as fontes tenham sido claramente reunidas momentos antes.\nQual regra fundamental você está violando?',
    options: [
      'Subagentes não herdam o contexto da conversa do pai; o coordenador precisa passar as fontes necessárias explicitamente no prompt do subagente.',
      'Subagentes compartilham o contexto do pai automaticamente, então os resultados da busca se perderam numa condição de corrida entre os dois subagentes.',
      'Subagentes só conseguem ler o contexto do pai se usarem o mesmo tier de modelo do coordenador.',
      'Subagentes herdam o contexto, mas os blocos `tool_result` são removidos, então só a prosa do agente de busca sobreviveu.',
    ],
    explanation:
      'Cada subagente começa com um contexto novo e isolado. Nada do pai (ou de subagentes irmãos) chega até ele a menos que o coordenador coloque isso no prompt daquele subagente.',
  },
  Q64: {
    prompt:
      'Um engenheiro pede que seu agente audite um monorepo de 900 arquivos em busca de todo uso remanescente de uma API depreciada, antes de removê-la. O código está dividido em quatro serviços independentes que não compartilham módulos, e o codebase completo é grande demais para caber em uma única janela de contexto. A precisão importa: um chamador esquecido significa quebra em produção na hora da remoção.\nQual abordagem de orquestração é a mais eficaz?',
    options: [
      'Ler cada arquivo sequencialmente no contexto principal até encontrar a API depreciada, e então parar.',
      'Carregar os quatro serviços em um único subagente com janela de contexto estendida e deixá-lo varrer tudo de uma vez.',
      'Pedir ao engenheiro que identifique manualmente qual serviço tem maior probabilidade de ser afetado e buscar apenas nele.',
      'Criar um subagente por serviço para buscar em seus arquivos em paralelo, cada um retornando uma lista estruturada de ocorrências, e então o coordenador mescla as quatro listas.',
    ],
    explanation:
      'Trabalho independente e paralelizável, com pegada total maior que uma janela de contexto, é o caso canônico de fan-out: um subagente focado por serviço, cada um retornando um resultado compacto que o coordenador combina.',
  },
  Q65: {
    prompt:
      'Você roda um pipeline de pesquisa de quatro etapas (busca → análise → síntese → escrita) sobre um lote de 20 fontes. O subagente de análise trava depois de processar apenas 8 das 20 fontes. Ao inspecionar, os resultados da busca de todas as 20 e as 8 análises concluídas estão salvos com segurança; as 12 fontes restantes nunca foram analisadas.\nComo o coordenador deve retomar para o melhor equilíbrio entre fidelidade e eficiência?',
    options: [
      'Reiniciar o pipeline inteiro a partir da busca para garantir uma execução consistente.',
      'Reexecutar a análise apenas nas 12 fontes não processadas e então mesclar com as 8 análises concluídas antes da síntese.',
      'Pular as 12 fontes restantes e sintetizar a partir das 8 análises já feitas.',
      'Passar as 20 fontes brutas diretamente para a síntese e descartar a etapa de análise por completo.',
    ],
    explanation:
      'Preserve o trabalho concluído e refaça só o que falta: analise as 12 restantes, mescle com as 8 e então sintetize. Sem recomputação desperdiçada, sem perda de cobertura.',
  },
  Q66: {
    prompt:
      'Pede-se a um coordenador que investigue por que uma métrica de negócio importante regrediu da noite para o dia. Os dados passam por três etapas — ingestão, transformação e relatório — e ninguém sabe de antemão qual etapa introduziu a regressão; a causa pode estar em qualquer uma delas, ou numa combinação.\nQual estratégia de decomposição de tarefas se encaixa melhor nesta investigação?',
    options: [
      'Fixar uma sequência rígida — checar ingestão, depois transformação, depois relatório — e rodar as três independentemente dos achados intermediários.',
      'Produzir um plano completo e exaustivo de todos os caminhos de código possíveis antes de ler qualquer coisa.',
      'Deixar o coordenador gerar a próxima subtarefa de investigação dinamicamente com base no que cada etapa revela, adaptando o plano conforme as evidências se acumulam.',
      'Criar as três investigações em paralelo sempre e sempre sintetizar todas as saídas, mesmo quando a primeira já encontrou a causa.',
    ],
    explanation:
      'Trabalho de diagnóstico é inerentemente adaptativo — cada achado muda o próximo passo mais útil. A decomposição dinâmica segue as evidências em vez de se comprometer com um plano fixo ou totalmente paralelo de antemão.',
  },
  Q67: {
    prompt:
      'Seu agente de pesquisa precisa reunir perfis de contexto sobre cinco empresas não relacionadas antes de produzir uma comparação. Cada consulta individual leva cerca de 20 segundos, e feitas uma após a outra a etapa inteira passa de um minuto e meio, do que os usuários reclamam. As cinco consultas não dependem umas das outras de forma alguma.\nQual a forma mais eficaz de reduzir o tempo total?',
    options: [
      'Criar cinco subagentes em paralelo, um por empresa, e então comparar os resumos que retornarem.',
      'Fazer as cinco consultas sequencialmente, mas com `max_tokens` maior para que cada uma termine mais rápido.',
      'Combinar as cinco empresas em um único prompt para o modelo pesquisar todas numa passada só.',
      'Cachear o resultado da primeira empresa e reutilizá-lo como template para as demais.',
    ],
    explanation:
      'Consultas independentes sem dependência de ordem paralelizam com facilidade: cinco subagentes concorrentes transformam 5×20s de trabalho sequencial em aproximadamente uma janela de 20s.',
  },
  Q68: {
    prompt:
      'Um agente de suporte está tratando um pedido de devolução. Ele chama `lookup_order`, e o `tool_result` retornado mostra que o item foi enviado há 60 dias — bem além da janela de devolução de 30 dias. O agente agora tem tanto `process_refund` quanto `escalate_to_human` disponíveis e precisa escolher um.\nComo o loop agêntico decide qual ferramenta chamar em seguida?',
    options: [
      'Uma tabela de roteamento fixa mapeia a idade do pedido diretamente para a próxima ferramenta, contornando o modelo.',
      'A própria ferramenta decide e dispara automaticamente a próxima ferramenta na sequência.',
      'O loop sempre chama as ferramentas na ordem em que foram registradas até uma ter sucesso.',
      'O `tool_result` é anexado à conversa e o modelo raciocina sobre ele para escolher a próxima chamada de ferramenta.',
    ],
    explanation:
      'O loop agêntico funciona anexando cada tool_result à conversa e deixando o modelo escolher a próxima ação. É assim que "60 dias → fora da política → escalar" é decidido.',
  },
  Q69: {
    prompt:
      'Usuários frequentemente enviam perguntas de acompanhamento como "me lembre o que a segunda fonte concluiu" durante uma sessão de pesquisa. O monitoramento mostra que cada uma leva mais de 40 segundos. A investigação revela que, para cada acompanhamento desses, o coordenador cria o subagente de síntese e reenvia todos os 80K tokens de achados acumulados — mesmo que o coordenador já tenha exatamente esses achados no próprio contexto, de quando orquestrou a pesquisa.\nQual a correção mais eficaz?',
    options: [
      'Habilitar prompt caching no subagente de síntese para que reenviar 80K tokens fique mais barato.',
      'Fazer o coordenador responder acompanhamentos simples de recuperação/resumo diretamente do próprio contexto, reservando a criação de subagentes para análises genuinamente novas.',
      'Pré-computar resumos em três granularidades toda vez que novos achados chegam.',
      'Dar ao subagente de síntese uma ferramenta para puxar achados do coordenador sob demanda.',
    ],
    explanation:
      'Criar um subagente para reingerir um contexto que o coordenador já tem é puro overhead. Para acompanhamentos simples, o coordenador deveria apenas responder ele mesmo.',
  },
  Q70: {
    prompt:
      'Depois de uma sessão longa e cara de análise em que o agente construiu um entendimento profundo de um módulo, um engenheiro quer prototipar duas refatorações concorrentes desse mesmo módulo. Cada protótipo deve partir exatamente do estado já analisado, e as duas tentativas não podem contaminar o contexto uma da outra, para os trade-offs serem comparados de forma limpa.\nQual a forma mais limpa de estruturar isso?',
    options: [
      'Continuar na mesma sessão, fazendo a refatoração A por completo e depois a refatoração B, em sequência.',
      'Iniciar duas sessões totalmente novas e reexecutar toda a análise em cada uma.',
      'Usar `fork_session` para ramificar a sessão analisada em duas linhas independentes, desenvolvendo uma refatoração em cada fork.',
      'Rodar as duas refatorações intercaladas em uma sessão e separá-las depois marcando as mensagens.',
    ],
    explanation:
      'O fork dá a cada refatoração seu próprio contexto isolado que parte da mesma linha de base de análise — exploração paralela com zero contaminação cruzada e sem reanálise.',
  },
  Q71: {
    prompt:
      'Você construiu um sistema de pesquisa orquestrador-trabalhador em que cada subagente roda no próprio contexto isolado e não consegue ver a conversa de nenhum outro subagente. No meio do processo, o subagente de síntese precisa de um dado específico que o subagente de busca descobriu antes.\nComo esse dado chega até o subagente de síntese?',
    options: [
      'O coordenador pega a saída do subagente de busca e inclui o dado no prompt do subagente de síntese.',
      'Os dois subagentes abrem um canal direto e passam o dado entre si.',
      'Ambos os subagentes leem de um contexto compartilhado que o framework sincroniza automaticamente.',
      'O subagente de síntese chama o subagente de busca como uma ferramenta aninhada para recuperá-lo.',
    ],
    explanation:
      'Subagentes são isolados; o coordenador é o único hub. Ele encaminha a saída relevante de cada trabalhador para o prompt do próximo.',
  },
  Q72: {
    prompt:
      'Você tem três arquivos CLAUDE.md em jogo ao mesmo tempo: um de nível de usuário `~/.claude/CLAUDE.md` dizendo "sempre use tabs", um de nível de projeto `CLAUDE.md` dizendo "use indentação de 2 espaços", e um de nível de diretório `CLAUDE.md` dentro de `src/legacy/` dizendo "acompanhe o estilo do arquivo ao redor". Você pede ao agente para editar um arquivo que fica em `src/legacy/`.\nQual orientação prevalece para essa edição?',
    options: [
      'O arquivo de nível de usuário sempre vence porque carrega primeiro e estabelece os padrões globais.',
      'O arquivo de nível de projeto sempre vence porque é a fonte canônica do repositório.',
      'Os três são concatenados com peso igual e o modelo escolhe arbitrariamente.',
      'A instrução mais específica (nível de diretório) vence para arquivos sob aquele diretório, sobrepondo-se às orientações de projeto e de usuário.',
    ],
    explanation:
      'Arquivos CLAUDE.md compõem do amplo ao específico, e o escopo mais próximo (mais específico) tem precedência — um arquivo de nível de diretório sobrepõe as orientações de projeto e de usuário para os arquivos da sua subárvore.',
  },
  Q73: {
    prompt:
      'Você quer uma regra de código que se aplique somente a arquivos de teste e fique fora do caminho em todo o resto. Você adiciona um arquivo de regra em `.claude/rules/` com YAML frontmatter, pretendendo que ele ative exclusivamente para caminhos que casem com `**/*.test.ts`.\nQual mecanismo restringe corretamente a regra apenas a esses arquivos?',
    options: [
      'Colocar o arquivo de regra fisicamente dentro de cada diretório de testes.',
      'Um padrão glob no frontmatter do arquivo de regra que casa com os caminhos-alvo, de modo que a regra só ativa quando os arquivos relevantes estão em jogo.',
      'Uma condicional escrita no corpo da regra que o modelo avalia em tempo de execução para cada arquivo.',
      'Nomear o arquivo de regra como `test.ts` para o Claude Code casar por nome de arquivo.',
    ],
    explanation:
      'Regras em `.claude/rules/` usam frontmatter (incluindo escopo por glob) para declarar quando se aplicam, então uma regra pode mirar `**/*.test.ts` e ficar inativa nos demais casos.',
  },
  Q74: {
    prompt:
      'Um engenheiro está prestes a deixar o agente fazer edições amplas em um serviço crítico e de alto tráfego. Antes de um único arquivo ser tocado, ele quer ver e aprovar a abordagem pretendida pelo agente — os arquivos que ele planeja mudar e a estratégia — para que um erro seja pego antes de qualquer mudança acontecer.\nQual recurso do Claude Code atende essa necessidade?',
    options: [
      'Rodar com `--dangerously-skip-permissions` para o plano executar imediatamente.',
      'Reduzir `max_tokens` para o agente produzir só um plano curto e nenhuma edição.',
      'Plan Mode, que faz o agente pesquisar e propor um plano para aprovação antes de fazer qualquer edição.',
      'Limpar o contexto com `/clear` para o agente começar a planejar do zero.',
    ],
    explanation:
      'O Plan Mode é exatamente isso: o agente investiga e apresenta um plano para o humano aprovar antes de qualquer mudança ser aplicada — um portão de revisão para trabalho de alto risco.',
  },
  Q75: {
    prompt:
      'Você está integrando o Claude Code ao seu pipeline de CI para revisar pull requests automaticamente a cada push. A etapa precisa rodar totalmente de forma não interativa (sem TTY), e deve emitir uma saída legível por máquina que um script downstream consiga parsear para postar comentários de revisão de volta no PR.\nQual invocação é apropriada?',
    options: [
      'Rodar headless com `-p` para um único prompt e `--output-format json` para o pipeline parsear resultados estruturados, com cada execução isolada.',
      'Abrir a TUI interativa e roteirizar teclas para conduzir a revisão.',
      'Rodar `-p` mas raspar o texto formatado para humanos do terminal com regex para extrair os achados.',
      'Iniciar uma sessão de longa duração compartilhada entre todos os PRs para o contexto acumular entre revisões.',
    ],
    explanation:
      'Para automação você usa o modo headless (`-p`) com `--output-format json` para saída parseável, e mantém cada execução do CI isolada por sessão para que as revisões não vazem estado umas para as outras.',
  },
  Q76: {
    prompt:
      'Seu CI roda o Claude Code a cada commit, em muitos pull requests concorrentes. Ao revisar os logs, você descobre que a revisão de um job referencia arquivos e contexto de um PR completamente diferente e não relacionado, que estava aberto ao mesmo tempo.\nQual a causa mais provável dessa contaminação cruzada?',
    options: [
      'O Claude Code cacheia o conteúdo dos arquivos globalmente entre máquinas por padrão.',
      'Os dados de treinamento do modelo incluíam o outro PR.',
      '`--output-format json` mescla as saídas de jobs concorrentes.',
      'Os jobs estão compartilhando/retomando a mesma sessão em vez de rodar isolados, então o contexto vaza entre execuções não relacionadas.',
    ],
    explanation:
      'Execuções automatizadas precisam ser isoladas por sessão. Se os jobs retomam ou compartilham um session id, o contexto acumulado de uma execução contamina outra — exatamente o vazamento entre PRs descrito.',
  },
  Q77: {
    prompt:
      'Seu time roda o mesmo prompt de várias etapas dezenas de vezes por dia — "rode o linter, resuma as falhas, depois proponha correções" — e todo mundo redigita ou copia e cola ele toda vez. Você quer que seja invocável como um comando curto, nomeado e reutilizável, compartilhado por todo o time no Claude Code.\nQual o mecanismo indicado?',
    options: [
      'Colar o prompt inteiro toda vez; não há como salvar prompts reutilizáveis.',
      'Definir um slash command customizado (um template de prompt salvo em `.claude/commands/`) que todo o time pode invocar pelo nome.',
      'Codificar as etapas no `CLAUDE.md` para que rodem automaticamente em toda mensagem.',
      'Criar um servidor MCP cujo único trabalho é guardar o texto do prompt.',
    ],
    explanation:
      'Fluxos de prompt repetidos pertencem a slash commands customizados — templates reutilizáveis em `.claude/commands/` que qualquer pessoa do time pode invocar pelo nome.',
  },
  Q78: {
    prompt:
      'Um engenheiro recém-integrado se vê reexplicando os mesmos fatos do projeto ao agente no início de toda sessão: o comando de build, qual test runner usar e as convenções de diretório do repositório. É repetitivo e propenso a erro.\nQual a forma indicada de fazer o agente lembrar desses detalhes de forma persistente entre sessões?',
    options: [
      'Pedir ao agente que memorize; ele vai reter isso entre sessões automaticamente.',
      'Colocar num comentário no topo de um arquivo-fonte e torcer para o agente ler.',
      'Registrar tudo no `CLAUDE.md` do projeto, que é carregado no contexto automaticamente no início de cada sessão.',
      'Aumentar a janela de contexto para as sessões anteriores permanecerem carregadas.',
    ],
    explanation:
      'O `CLAUDE.md` é a memória persistente do projeto: convenções, comandos e restrições colocados ali carregam em toda sessão automaticamente, então você não precisa repetir.',
  },
  Q79: {
    prompt:
      'Uma política de segurança rígida diz que o agente nunca, sob nenhuma circunstância, pode editar arquivos no diretório `secrets/` — e isso precisa valer independentemente de como o modelo for instruído, incluindo instruções adversariais ou acidentais que possam convencê-lo a fazer uma edição.\nQual a forma mais confiável de impor isso no Claude Code?',
    options: [
      'Um hook PreToolUse que inspeciona chamadas de Edit/Write e bloqueia qualquer uma que mire `secrets/` antes da ferramenta rodar.',
      'Uma regra enfática no `CLAUDE.md` proibindo edições em `secrets/`.',
      'Um exemplo few-shot no system prompt mostrando o agente recusando tais edições.',
      'Remover a ferramenta Edit por completo durante a sessão inteira.',
    ],
    explanation:
      'Políticas duras e inegociáveis pertencem fora da discrição do modelo. Um hook PreToolUse intercepta e bloqueia a chamada de ferramenta de forma determinística toda vez, independentemente do prompt.',
  },
  Q80: {
    prompt:
      'Você precisa que o Claude retorne dados de produto (nome, preço, dimensões, tags) como JSON estrito que seu serviço downstream consiga desserializar diretamente em objetos tipados, sem uma camada frágil de parsing de texto ou limpeza no meio.\nQual o mecanismo canônico para obter saída estruturada confiável?',
    options: [
      'Pedir ao Claude em prosa para "responder apenas com JSON" e dar `JSON.parse` no texto da mensagem.',
      'Solicitar Markdown e remover as cercas de código antes de parsear.',
      'Baixar a temperatura para 0 para que a saída de texto seja sempre JSON válido.',
      'Definir uma ferramenta cujo `input_schema` seja o seu JSON schema e deixar o Claude "chamá-la", de modo que os argumentos cheguem como dados estruturados validados pelo schema.',
    ],
    explanation:
      'Tool use é o mecanismo canônico de saída estruturada: o modelo emite argumentos que obedecem ao seu input_schema, então você recebe dados estruturados validados em vez de parsear texto livre.',
  },
  Q81: {
    prompt:
      'Em produção, cerca de 6% das suas extrações falham na validação de JSON schema — tipos errados, campos obrigatórios faltando, enums malformados. Você quer um loop de recuperação automática que resolva a grande maioria delas sem um humano no meio.\nQual o padrão padrão para isso?',
    options: [
      'Descartar silenciosamente as extrações que falham para manter a taxa de sucesso alta.',
      'Na falha de validação, chamar o modelo de novo com o erro de validação específico anexado, deixando-o corrigir a saída — geralmente resolvido em algumas tentativas.',
      'Desabilitar a validação de schema para que nada falhe.',
      'Mudar todos os campos para string para que qualquer saída valide.',
    ],
    explanation:
      'Um loop de validação-retry que devolve o erro concreto ao modelo resolve a maioria dos erros de formato em 1 a 3 tentativas, porque o modelo consegue ver exatamente o que corrigir.',
  },
  Q82: {
    prompt:
      'Seu extrator continua formatando o mesmo campo de forma inconsistente de um documento para o outro — às vezes "Cotton/Poly", às vezes "cotton blend", e ocasionalmente omitindo por completo mesmo quando o material está claramente indicado. Você já adicionou instruções explícitas no prompt descrevendo o formato desejado e isso não resolveu a inconsistência.\nQual o próximo passo mais eficaz?',
    options: [
      'Subir o tier do modelo e torcer para o seguimento de instruções melhorar.',
      'Tornar o campo obrigatório para nunca ser omitido.',
      'Adicionar exemplos few-shot mostrando o formato canônico exato que você espera para aquele campo.',
      'Rodar três extrações e ficar com o formato majoritário.',
    ],
    explanation:
      'Exemplos few-shot demonstram concretamente o formato-alvo, ensinando ao modelo a representação canônica e melhorando tanto a consistência quanto a recuperação de campos que estavam sendo pulados.',
  },
  Q83: {
    prompt:
      'Documentos chegam de forma constante ao longo do dia útil e cada um precisa passar pelo seu modelo de extração. Os resultados, porém, só são necessários na manhã seguinte — não há requisito de tempo real. O volume é alto e você está sob pressão para minimizar o custo de modelo desse pipeline.\nQual escolha de API se encaixa, e por quê?',
    options: [
      'A Message Batches API, que oferece custo cerca de 50% menor com uma janela de processamento assíncrona que cabe confortavelmente num SLA de um dia para o outro.',
      'A Messages API em tempo real, porque o batch não garante resultados até de manhã.',
      'A API em tempo real com temperatura 0 para reduzir o uso de tokens.',
      'A Batches API só se todos os documentos forem idênticos, senão tempo real.',
    ],
    explanation:
      'Cargas tolerantes a latência e de alto volume são o ponto forte da Batches API: cerca de 50% mais barata com uma janela assíncrona (até 24h) que atende facilmente um prazo de um dia para o outro.',
  },
  Q84: {
    prompt:
      'Seu serviço de extração define uma ferramenta `emit_record` e espera que toda resposta seja uma chamada a ela, para um parser estrito consumir os argumentos estruturados. Em produção, porém, o modelo ocasionalmente responde com uma explicação em texto em vez de invocar a ferramenta, e cada uma dessas respostas quebra o parser.\nComo garantir que o modelo sempre chame a ferramenta?',
    options: [
      'Adicionar "SEMPRE chame a ferramenta" em letras maiúsculas no system prompt e confiar nisso.',
      'Parsear a resposta em texto como fallback sempre que a ferramenta não for chamada.',
      'Remover a ferramenta e pedir JSON em prosa em vez disso.',
      'Definir `tool_choice` para forçar a ferramenta específica, de modo que o modelo tenha que retornar uma chamada de `emit_record` em vez de texto livre.',
    ],
    explanation:
      '`tool_choice` definido para uma ferramenta específica força o modelo a invocar exatamente aquela ferramenta, eliminando as respostas em texto livre que quebram um parser que espera saída estruturada.',
  },
  Q85: {
    prompt:
      'Você está extraindo campos de registros regulatórios onde um erro pode ter consequências de compliance, então a precisão de uma única passada não é boa o suficiente. Você tem, no entanto, orçamento para chamadas adicionais ao modelo por documento.\nQual técnica mais aumenta a confiabilidade nessas extrações de alto risco?',
    options: [
      'Aumentar `max_tokens` para a passada única ter mais espaço.',
      'Rodar uma segunda passada em que o modelo revisa a própria extração contra a fonte e sinaliza/corrige discrepâncias.',
      'Extrair duas vezes com temperatura 0 e ficar com o primeiro resultado.',
      'Encurtar o schema para haver menos coisas a errar.',
    ],
    explanation:
      'Uma revisão em várias passadas — em que uma segunda chamada verifica a extração contra a fonte — pega erros que a primeira passada perdeu, trocando custo extra por confiabilidade materialmente maior em documentos críticos.',
  },
  Q86: {
    prompt:
      'No seu schema de extração o modelo continua trocando dois campos numéricos — `net_amount` e `gross_amount` — colocando a cifra errada em cada um. Só os nomes dos campos claramente não bastam para o modelo distingui-los em documentos ambíguos.\nQual a correção mais eficaz no nível do schema?',
    options: [
      'Renomear os dois campos para `amount_1` e `amount_2`.',
      'Tornar os dois campos obrigatórios para nenhum ser pulado.',
      'Adicionar descrições claras a cada campo no schema explicando exatamente o que significam e como distingui-los.',
      'Mesclá-los em um único campo `amount`.',
    ],
    explanation:
      'As descrições de campo no schema são lidas pelo modelo e são a alavanca principal de desambiguação — explicitar o que é `net` vs `gross` resolve a confusão na origem.',
  },
  Q87: {
    prompt:
      'Você precisa extrair cláusulas específicas de contratos que rotineiramente são muito mais longos do que uma única requisição consegue processar confortavelmente — alguns têm centenas de páginas. Você ainda precisa de toda cláusula relevante, com a redação exata preservada e rastreável até onde apareceu.\nQual a estratégia de extração mais confiável?',
    options: [
      'Dividir o documento em seções, extrair de cada uma e então mesclar os resultados — mantendo o registro de qual seção cada valor veio.',
      'Truncar cada contrato às primeiras páginas e extrair apenas delas.',
      'Colar o contrato inteiro independentemente do tamanho e deixar o modelo decidir o que manter.',
      'Resumir o contrato primeiro e depois extrair as cláusulas do resumo.',
    ],
    explanation:
      'Para documentos que excedem um tamanho confortável de requisição, divida por seção, extraia por bloco e mescle com a proveniência da fonte — você preserva a cobertura sem perder rastreabilidade. Resumir primeiro descartaria o texto exato da cláusula que você precisa.',
  },
  Q88: {
    prompt:
      'Você está ajustando como um agente de suporte usa ferramentas. No fluxo conversacional geral (saudações, conversa fiada) você quer que o modelo decida sozinho se alguma ferramenta é sequer necessária. Mas você também tem um fluxo separado e dedicado em que chamar uma ferramenta específica é obrigatório e inegociável.\nQual combinação de configurações de `tool_choice` corresponde a esses dois fluxos?',
    options: [
      'Usar `any` em todo lugar para o modelo sempre chamar alguma ferramenta, inclusive em saudações.',
      'Omitir `tool_choice` por completo; ele não tem efeito no comportamento.',
      'Usar `auto` para o fluxo obrigatório e `none` para o geral.',
      'Usar `auto` para o fluxo geral (o modelo decide) e forçar a ferramenta específica onde a chamada é obrigatória.',
    ],
    explanation:
      '`auto` deixa o modelo escolher se chama uma ferramenta (certo para saudações), enquanto forçar uma ferramenta específica garante a chamada onde ela é obrigatória. `any` forçaria erroneamente uma ferramenta até numa saudação simples.',
  },
  Q89: {
    prompt:
      'Seu servidor MCP de ferramentas de dev expõe uma única ferramenta geral `code_op` que recebe um parâmetro `instruction` de texto livre. Os resultados são inconsistentes: "encontre chamadores" às vezes volta como edições, enquanto "renomeie este símbolo" às vezes volta como um relatório escrito em vez de uma mudança de fato.\nQual mudança de design mais melhora a confiabilidade?',
    options: [
      'Manter a ferramenta única mas escrever uma descrição mais longa com mais exemplos de instruções.',
      'Dividi-la em ferramentas com propósito específico (`find_callers`, `rename_symbol`, `extract_function`), cada uma com um contrato de entrada/saída definido.',
      'Adicionar um pré-classificador que reescreve a instrução antes da ferramenta rodar.',
      'Baixar a temperatura para a instrução de texto livre ser interpretada de forma determinística.',
    ],
    explanation:
      'Instruções de texto livre empurram a semântica para a prosa, que o modelo interpreta de forma inconsistente. Ferramentas com propósito específico dão contratos explícitos e bem tipados, então o modelo escolhe a operação certa de forma confiável.',
  },
  Q90: {
    prompt:
      'Você está decidindo se investe em construir um servidor MCP customizado que ofereça uma ferramenta de "buscar no codebase", mesmo que o Claude Code já venha com as ferramentas built-in Grep e Glob, que cobrem busca básica por texto e por nome de arquivo.\nQuando construir a ferramenta MCP é a escolha certa?',
    options: [
      'Sempre construir ferramentas MCP; as built-in estão depreciadas em configurações agênticas.',
      'Nunca construir ferramentas MCP quando existe uma built-in, mesmo para capacidades muito diferentes.',
      'Quando ela oferece capacidade que as built-in não têm (ex.: consultas semânticas/cientes de AST); se só duplica o Grep, prefira a built-in.',
      'Construir só se a built-in estiver temporariamente falhando.',
    ],
    explanation:
      'Adicione uma ferramenta MCP quando ela oferece algo que as built-in genuinamente não fazem. Duplicar uma built-in existente só adiciona ambiguidade de seleção e manutenção sem ganho.',
  },
  Q91: {
    prompt:
      'Sua ferramenta `get_customer` retorna o resultado como uma única frase em prosa, por exemplo "John, membro gold desde 2019 com 2 tickets abertos." Sua lógica downstream tenta ler o tier de assinatura e a contagem de tickets abertos a partir dessa frase, e continua parseando errado ambos quando a redação varia um pouco.\nQual o melhor design para a saída da ferramenta?',
    options: [
      'Retornar campos estruturados (ex.: `name`, `tier`, `memberSince`, `openTickets`) para o agente e o código downstream lerem de forma inequívoca.',
      'Retornar uma frase ainda mais longa e descritiva para maior clareza.',
      'Retornar a prosa mas também logar os dados estruturados no servidor.',
      'Pedir ao modelo para reformatar a prosa em campos após cada chamada.',
    ],
    explanation:
      'Ferramentas devem retornar dados estruturados, não prosa, para que tanto o modelo quanto o código downstream leiam campos individuais de forma confiável em vez de parsear frases.',
  },
  Q92: {
    prompt:
      'Sua ferramenta `process_refund` às vezes é invocada com um order id faltando ou um valor ambíguo e não especificado, e cada uma dessas chamadas ruins produz um erro de backend e uma interação frustrada com o cliente. A ferramenta atualmente aceita entrada frouxa e só valida no backend.\nQual mudança de design de ferramenta mais reduz essas chamadas malformadas?',
    options: [
      'Aceitar qualquer entrada e validar apenas no backend, retornando erros depois do fato.',
      'Adicionar uma nota no system prompt pedindo ao modelo para ter cuidado.',
      'Deixar a ferramenta adivinhar os valores faltantes a partir do contexto da conversa.',
      'Tornar order id e valor parâmetros obrigatórios e bem descritos no `input_schema` da ferramenta, de modo que o modelo tenha que fornecê-los corretamente.',
    ],
    explanation:
      'Um input_schema preciso com parâmetros obrigatórios e claramente descritos restringe o modelo a produzir chamadas válidas de antemão, prevenindo classes inteiras de invocações malformadas.',
  },
  Q93: {
    prompt:
      'Um agente tem duas ferramentas relacionadas a cobrança, `refund_order` e `cancel_subscription`, e para reclamações de cobrança às vezes dispara a errada. As duas descrições são lacônicas — "lida com reembolsos" e "lida com cancelamentos" — sem nada sobre quando uma se aplica em vez da outra.\nQual a correção mais eficaz?',
    options: [
      'Mesclar as duas ferramentas em uma única `billing_action` com uma flag de modo.',
      'Reescrever cada descrição para dizer claramente quando usá-la e quando não usá-la, incluindo as condições que as distinguem.',
      'Remover uma das ferramentas durante conversas de cobrança.',
      'Adicionar diálogos few-shot para toda forma de falar de cobrança que você conseguir imaginar.',
    ],
    explanation:
      'A seleção de ferramentas é guiada pelas descrições. Explicitar quando cada ferramenta se aplica (e quando não) é a forma mais direta e escalável de impedir que o modelo confunda ferramentas sobrepostas.',
  },
  Q94: {
    prompt:
      'Depois de conectar cinco servidores MCP separados ao seu agente, a seleção de ferramentas dele piorou visivelmente — agora ele às vezes recorre a ferramentas irrelevantes que não servem para a tarefa. Você conta cerca de 40 ferramentas expostas no total, e boa parte delas nunca é de fato usada nos seus fluxos.\nQual o remédio mais eficaz?',
    options: [
      'Manter todas as 40 ferramentas; mais opções sempre ajudam o modelo.',
      'Renomear todas as ferramentas com um prefixo numérico para impor uma ordem.',
      'Curar o conjunto de ferramentas expostas até apenas as que o agente realmente precisa, reduzindo a ambiguidade de seleção.',
      'Aumentar `max_tokens` para o modelo conseguir considerar todas as ferramentas.',
    ],
    explanation:
      'Um conjunto inchado de ferramentas aumenta a chance de má seleção. Curar até as ferramentas relevantes afia as escolhas do modelo — poucas ferramentas bem escopadas superam um catálogo espalhado.',
  },
  Q95: {
    prompt:
      'Toda conversa de suporte que seu agente atende começa com o mesmo bloco de 8K tokens no system prompt: um manual de política mais a documentação de ferramentas, que nunca muda entre requisições. Latência e custo estão ambos altos, e o profiling mostra que esse prefixo idêntico está sendo reprocessado do zero em cada chamada de API.\nQual a otimização mais eficaz?',
    options: [
      'Habilitar prompt caching no prefixo estável para que o conteúdo repetido de política/ferramentas seja reutilizado em vez de reprocessado a cada chamada.',
      'Apagar o manual de política do prompt e torcer para o modelo se lembrar.',
      'Resumir o manual para 1K tokens, aceitando a perda de detalhe.',
      'Baixar `max_tokens` para reduzir o custo por requisição.',
    ],
    explanation:
      'Um prefixo grande e imutável reutilizado entre requisições é o caso clássico de prompt caching — o prefixo cacheado corta latência e custo sem sacrificar nenhum conteúdo.',
  },
  Q96: {
    prompt:
      'Um agente que escreve relatórios recebe 30 fontes em um único prompt e é solicitado a costurá-las. Na prática, ele cita de forma confiável as primeiras e as últimas fontes, mas consistentemente negligencia as que ficam enterradas no meio desse contexto longo, deixando lacunas visíveis na cobertura.\nQual a mitigação mais eficaz?',
    options: [
      'Adicionar as 30 fontes de novo, uma segunda vez, para reforçá-las.',
      'Aumentar a temperatura para o modelo amostrar mais o meio.',
      'Dizer ao modelo "leia cada fonte igualmente" e confiar nisso.',
      'Posicionar as fontes mais importantes no início e no fim do contexto, e/ou processar as fontes em lotes menores e focados.',
    ],
    explanation:
      'Os modelos prestam mais atenção ao começo e ao fim de contextos longos (o efeito lost-in-the-middle). Posicionar o material-chave nas bordas — ou processar em lotes — contrabalança a negligência.',
  },
  Q97: {
    prompt:
      'Uma sessão longa de pesquisa está se aproximando do limite de contexto do modelo, mas achados do início da sessão ainda importam para o relatório final que você está prestes a gerar. Você precisa ficar sob o limite sem jogar fora a informação que ainda conta.\nQual abordagem preserva a informação mais útil dentro do orçamento?',
    options: [
      'Truncar de imediato a metade mais antiga das mensagens.',
      'Resumir progressivamente as porções mais antigas e estáveis em achados compactos, mantendo o fio ativo na íntegra.',
      'Não fazer nada e deixar a API descartar o que não couber.',
      'Reiniciar a sessão do zero para recuperar a janela inteira.',
    ],
    explanation:
      'O resumo progressivo comprime o material anterior já consolidado em achados densos, preservando o trabalho ativo na íntegra — a forma padrão de ficar sob o limite sem perder sinal importante.',
  },
  Q98: {
    prompt:
      'Você habilita prompt caching para cortar custo e latência, mas a taxa de acerto do cache permanece teimosamente baixa. Investigando, você descobre que seu prompt coloca um pequeno bloco de perfil por usuário logo no topo, imediatamente seguido do grande manual de política compartilhado, que é idêntico para todo usuário.\nPor que o cache é ineficaz aqui, e qual a correção?',
    options: [
      'O cache é por conta e não funciona com múltiplos usuários de forma alguma.',
      'O manual é grande demais para cachear; encolha-o abaixo do limite de tamanho do cache.',
      'O cache se baseia no prefixo; um bloco por usuário no início muda o prefixo a cada requisição. Coloque o conteúdo compartilhado estável primeiro e o variável depois, para o prefixo compartilhado ser cacheável.',
      'O cache só funciona com temperatura 0; suba-a e tente de novo.',
    ],
    explanation:
      'O prompt caching reutiliza um prefixo estável. Se conteúdo específico do usuário fica antes do manual compartilhado, o prefixo difere a cada chamada e nada acerta. Ordene estável primeiro, variável por último para o grande bloco compartilhado permanecer um prefixo cacheável.',
  },
  Q99: {
    prompt:
      'Para fazer um agente de suporte "saber de tudo", um engenheiro cola a base de conhecimento inteira de 200 páginas no system prompt de cada requisição. Depois da mudança, as respostas ficaram mais lentas e, em algumas perguntas, na verdade menos precisas do que antes.\nQual a melhor abordagem?',
    options: [
      'Recuperar apenas os trechos relevantes da base por consulta (ex.: via busca/ferramentas) em vez de carregar a base inteira toda vez.',
      'Colar a base duas vezes para o modelo não perder nada.',
      'Manter a base completa mas baixar a temperatura para afiar as respostas.',
      'Dividir a base em várias mensagens de sistema na mesma requisição.',
    ],
    explanation:
      'A janela de contexto é finita e enchê-la degrada foco e velocidade. Recupere só os trechos relevantes a cada consulta em vez de carregar a base de conhecimento inteira toda vez.',
  },
  Q100: {
    prompt:
      'Seu agente de pesquisa ocasionalmente afirma conclusões confiantes e definitivas nos relatórios finais que depois se mostram não sustentadas por nenhuma das fontes que ele reuniu. Você quer aumentar a confiabilidade, mas não quer sufocar cada frase com "possivelmente" e "talvez" e deixar os relatórios inutilmente vagos.\nQual a adição mais eficaz?',
    options: [
      'Instruir o agente a adicionar "possivelmente" ou "talvez" em toda frase.',
      'Usar sempre uma única fonte para não haver nada a reconciliar.',
      'Aumentar a temperatura para o agente considerar mais possibilidades.',
      'Adicionar uma passada de verificação que cruza cada afirmação-chave contra as fontes reunidas e sinaliza as que não têm sustentação antes do relatório ser finalizado.',
    ],
    explanation:
      'Uma etapa de verificação dedicada que vincula cada afirmação de volta à sua fonte de sustentação pega especificamente as afirmações sem suporte, melhorando a confiabilidade sem ressalvas generalizadas que deixariam o relatório vago.',
  },
}
