import Link from "next/link";
import styles from "./styles.module.scss";
import Logo from "@/components/Logo";
import Head from "next/head";

export default function TermsOfUse() {
  const supportMail = "support@artcode.dev";

  return (
    <>
      <Head>
        <title>Termos de Uso • Systatus.Live</title>
      </Head>
      <div className={styles["container"]}>
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        
        <h1>TERMOS DE USO</h1>

        <p className="my-3">Última atualização: 10 de maio de 2025</p>

        <h3 className="my-3">ACEITAÇÃO DOS NOSSOS TERMOS LEGAIS</h3>

        <p className="my-3">Somos ARTUR MIGUEL ROCHA DESENVOLVIMENTO DE SOFTWARE, CNPJ 43.682.698/0001-85, atuando como
          Artcode ("Empresa", "nós",
          "nos", "nosso"), uma empresa registrada no Brasil, localizada na Av. Anselmo Alves dos Santos, 1076 - loja 01, CXPST 98,
          Uberlândia,
          Minas Gerais, 38408-097.</p>

        <p className="my-3">Operamos o site <Link href="/">https://systatus.live</Link> (o "Site"), assim como quaisquer outros produtos e
          serviços relacionados que mencionem ou estejam vinculados a estes termos legais (os "Termos Legais") (coletivamente, os "Serviços").</p>

        <p className="my-3">O Systatus Live é um sistema de monitoramento de aplicações que verifica continuamente a disponibilidade dos seus
          serviços web. Quando uma indisponibilidade é detectada, notificações são enviadas automaticamente para mantê-lo informado.</p>

        <p className="my-3">Você pode entrar em contato conosco por e-mail em {supportMail} ou por correspondência para Av. Anselmo Alves dos
          Santos,
          1076 - loja 01, CXPST 98, Uberlândia, Minas Gerais, 38408-097, Brasil.</p>

        <p className="my-3">Estes Termos Legais constituem um contrato juridicamente vinculativo entre você, seja como pessoa física ou representante de uma entidade ("você"), e a ARTUR MIGUEL ROCHA DESENVOLVIMENTO DE SOFTWARE, referente ao seu acesso e uso dos Serviços. Ao acessar os Serviços, você declara que leu, entendeu e concorda com todos os Termos Legais aqui descritos. SE VOCÊ NÃO CONCORDAR COM TODOS ESTES TERMOS, VOCÊ ESTÁ EXPRESSAMENTE PROIBIDO DE UTILIZAR OS SERVIÇOS E DEVE ENCERRAR O USO IMEDIATAMENTE.</p>

        <p className="my-3">Informaremos previamente sobre quaisquer mudanças programadas nos Serviços que você estiver utilizando.
          As mudanças nestes Termos Legais entrarão em vigor trinta (30) dias após o aviso, exceto se relacionadas a novas
          funcionalidades, atualizações de segurança, correções de erros ou determinações judiciais, que entrarão em vigor
          imediatamente. Ao continuar usando os Serviços após essas mudanças, você concorda com os termos modificados. Caso não concorde, poderá encerrar o uso conforme a seção "VIGÊNCIA E RESCISÃO".</p>

        <p className="my-3">Todos os usuários menores de idade na jurisdição onde residem (geralmente menores de 18 anos) devem ter permissão e supervisão direta dos pais ou responsável legal para utilizar os Serviços. Se você for menor de idade, seu responsável deve ler e aceitar estes Termos Legais antes da utilização.</p>

        <p className="my-3">Recomendamos que você imprima uma cópia destes Termos Legais para sua referência.</p>

        <h3 className="my-3">1. NOSSOS SERVIÇOS</h3>
        <p className="my-3">
          As informações fornecidas ao utilizar os Serviços não se destinam à distribuição ou uso por qualquer pessoa ou
          entidade em qualquer jurisdição ou país onde tal distribuição ou uso sejam contrários à legislação ou regulamentação aplicável, ou que nos sujeitem a qualquer exigência de registro naquela jurisdição ou país. Assim, quem optar por acessar os Serviços a partir de outras localidades o faz por iniciativa própria e é integralmente responsável pelo cumprimento das leis locais, se e quando aplicável.
        </p>

        <h3 className="my-3">2. DIREITOS DE PROPRIEDADE INTELECTUAL</h3>

        <h4 className="mb-3">Nossa propriedade intelectual</h4>

        <p className="my-3">Somos proprietários ou licenciados de todos os direitos de propriedade intelectual relacionados aos nossos Serviços, incluindo todo o código-fonte,
          bancos de dados, funcionalidades, softwares, designs do site, áudios, vídeos, textos, fotografias e gráficos presentes nos Serviços (coletivamente, o "Conteúdo"), bem como as marcas, marcas de serviço e logotipos ali contidos (as "Marcas").
        </p>

        <p className="my-3">Nosso Conteúdo e nossas Marcas são protegidos por leis de direitos autorais, marcas registradas (e outras legislações de propriedade intelectual e concorrência desleal) tanto no Brasil quanto em outras partes do mundo.</p>

        <p className="my-3">O Conteúdo e as Marcas são fornecidos nos Serviços "NO ESTADO EM QUE SE ENCONTRAM", apenas para seu uso pessoal, não comercial ou para fins internos da sua empresa.</p>

        <h4 className="my-3">Seu uso dos nossos Serviços</h4>
        <p className="my-3">Desde que você cumpra com estes Termos Legais, incluindo a seção "ATIVIDADES PROIBIDAS" abaixo, concedemos
          a você uma licença não exclusiva, intransferível e revogável para:</p>
        <ul className="list-disc list-inside">
          <li>acessar os Serviços; e</li>
          <li>baixar ou imprimir uma cópia de qualquer parte do Conteúdo ao qual você tenha tido acesso de forma lícita,</li>
        </ul>

        <p className="my-3">exclusivamente para seu uso pessoal, não comercial ou para fins internos da sua empresa.</p>

        <p className="my-3">
          Exceto conforme previsto nesta seção ou em outra parte destes Termos Legais, nenhuma parte dos Serviços, nem qualquer Conteúdo ou Marca
          poderá ser copiada, reproduzida, agregada, republicada, carregada, publicada, exibida publicamente, codificada, traduzida,
          transmitida, distribuída, vendida, licenciada ou explorada comercialmente, sem nossa autorização prévia por escrito.
        </p>

        <p className="my-3">Caso deseje utilizar qualquer parte dos Serviços, Conteúdo ou Marcas de maneira não prevista nestes Termos Legais, envie sua solicitação para: {supportMail}. Se concedermos permissão para publicar, reproduzir ou exibir qualquer parte dos nossos Serviços ou Conteúdo, você deverá nos identificar como os proprietários ou licenciadores e garantir que qualquer aviso de direito autoral ou propriedade esteja visível na publicação, reprodução ou exibição do nosso Conteúdo.</p>

        <p className="my-3">
          Reservamo-nos todos os direitos que não tenham sido expressamente concedidos a você em relação aos Serviços, Conteúdo e Marcas.
        </p>

        <p className="my-3"> Qualquer violação a esses direitos de propriedade intelectual constituirá uma infração material destes Termos Legais e resultarará na rescisão imediata do seu direito de uso dos nossos Serviços.</p>

        <h4 className="my-3">Suas submissões</h4>
        <p className="my-3">
          Leia atentamente esta seção e a seção "ATIVIDADES PROIBIDAS" antes de utilizar os Serviços para entender
          (a) os direitos que você nos concede e (b) as suas obrigações ao postar ou enviar qualquer conteúdo pelos Serviços.
        </p>

        <p className="my-3">
          <b>Submissões:</b> Ao nos enviar diretamente qualquer pergunta, comentário, sugestão, ideia, feedback ou outra informação sobre
          os Serviços ("Submissões"), você concorda em nos ceder todos os direitos de propriedade intelectual sobre esse material. Você concorda
          que seremos os proprietários da Submissão e teremos o direito irrestrito de usá-la e divulgá-la para qualquer finalidade legal,
          comercial ou não, sem necessidade de reconhecimento ou compensação.
        </p>

        <p className="my-3"><b>Você é responsável pelo que publica ou envia:</b> Ao nos enviar Submissões por qualquer meio dos Serviços, você:</p>
        <ul className="list-disc list-inside">
          <li>
            confirma que leu e concorda com nossa seção "ATIVIDADES PROIBIDAS" e não publicará, enviará, carregará ou transmitirá qualquer Submissão ilegal, ofensiva, difamatória, obscena, abusiva, discriminatória, ameaçadora, sexualmente explícita, falsa, enganosa ou fraudulenta;
          </li>
          <li>
            na medida permitida por lei, renuncia a quaisquer direitos morais sobre tal Submissão;
          </li>
          <li>
            declara que a Submissão é de sua autoria ou que você possui os direitos e licenças necessárias para enviá-la e nos conceder os direitos mencionados;
          </li>
          <li>
            declara que a Submissão não é considerada informação confidencial.
          </li>
          <p className="my-3">
            Você é o único responsável pelas suas Submissões e concorda expressamente em nos indenizar por quaisquer perdas decorrentes da sua violação (a) desta seção, (b) de direitos de terceiros ou (c) da legislação aplicável.
          </p>
        </ul>

        <h3 className="my-3">3. DECLARAÇÕES DO USUÁRIO</h3>
        <p className="my-3">
          Ao utilizar os Serviços, você declara e garante que: (1) todas as informações de cadastro fornecidas por você serão verdadeiras, precisas, atuais e completas; (2) você manterá a exatidão dessas informações e as atualizará prontamente conforme necessário; (3) você possui capacidade legal e concorda em cumprir estes Termos Legais; (4) você não é menor de idade na jurisdição onde reside; (5) você não acessará os Serviços por meios automatizados ou não humanos, como bots ou scripts; (6) você não utilizará os Serviços para nenhum propósito ilegal ou não autorizado; e (7) seu uso dos Serviços não violará nenhuma lei ou regulamentação aplicável.
        </p>

        <p className="my-3">
          Caso qualquer informação fornecida por você seja falsa, imprecisa, desatualizada ou incompleta, reservamo-nos o direito de suspender ou encerrar sua conta e recusar qualquer uso atual ou futuro dos Serviços (ou parte deles).
        </p>

        <h3 className="my-3">4. REGISTRO DE USUÁRIO</h3>
        <p className="my-3">
          Você poderá ser solicitado a se registrar para utilizar os Serviços. Você concorda em manter sua senha em sigilo e será responsável por todo uso da sua conta e senha. Reservamo-nos o direito de remover, reivindicar ou alterar qualquer nome de usuário que considerarmos, a nosso exclusivo critério, inapropriado, ofensivo ou inaceitável.
        </p>

        <h3 className="my-3">5. COMPRAS E PAGAMENTOS</h3>
        <p className="my-3">
          Aceitamos as seguintes formas de pagamento:
        </p>

        <ul className="list-disc list-inside">
          <li>Cartões de Crédito</li>
        </ul>

        <p className="my-3">
          Você concorda em fornecer informações atuais, completas e precisas sobre compras e conta para todas as transações feitas através dos Serviços. Concorda também em atualizar prontamente suas informações de conta e pagamento, incluindo e-mail, método de pagamento e data de validade do cartão, para que possamos concluir suas transações e entrar em contato, se necessário. Impostos sobre vendas poderão ser adicionados aos valores, conforme determinado por nós. Os preços poderão ser alterados a qualquer momento. Todos os pagamentos deverão ser efetuados em Reais.
        </p>

        <p className="my-3">
          Você concorda em pagar todos os encargos aos preços vigentes no momento da compra, incluindo eventuais taxas de envio aplicáveis, e nos autoriza a debitar esses valores no método de pagamento escolhido ao efetuar seu pedido. Reservamo-nos o direito de corrigir quaisquer erros ou omissões de preços, mesmo após o pagamento já ter sido solicitado ou recebido.
        </p>

        <p className="my-3">
          Reservamo-nos o direito de recusar qualquer pedido realizado através dos Serviços. Podemos, a nosso exclusivo critério, limitar ou cancelar quantidades adquiridas por pessoa, por domicílio ou por pedido. Essas restrições podem incluir pedidos feitos por ou sob a mesma conta, método de pagamento, e/ou endereço de cobrança ou entrega. Também podemos limitar ou proibir pedidos que, a nosso ver, aparentem ser realizados por revendedores ou distribuidores.
        </p>

        <h3 className="my-3">6. ASSINATURAS</h3>
        <h4 className="my-3">Cobrança e Renovação</h4>
        <p className="my-3">
          Sua assinatura continuará em vigor e será renovada automaticamente, salvo cancelamento. Você consente que cobremos o valor correspondente de forma recorrente no seu método de pagamento, sem necessidade de aprovação prévia a cada renovação, até que você cancele a assinatura. O período de cobrança dependerá do plano escolhido no momento da contratação dos Serviços.
        </p>

        <h4 className="my-3">Teste Gratuito</h4>
        <p className="my-3">
          Oferecemos um teste gratuito de 30 dias para novos usuários registrados nos Serviços. Durante esse período, a conta não será cobrada e a assinatura será suspensa até que seja feita a atualização para uma versão paga após o término do teste gratuito.
        </p>

        <h4 className="my-3">Cancelamento</h4>
        <p className="my-3">
          Todas as compras são não reembolsáveis. Você pode cancelar sua assinatura a qualquer momento acessando sua conta. O cancelamento terá efeito ao final do período já pago. Se tiver dúvidas ou estiver insatisfeito com os Serviços, envie um e-mail para {supportMail}.
        </p>

        <h4 className="my-3">Alterações de Preço</h4>
        <p className="my-3">
          Podemos, eventualmente, realizar ajustes no valor da assinatura e comunicaremos qualquer alteração de preço conforme a legislação aplicável.
        </p>

        <h3 className="my-3">7. ATIVIDADES PROIBIDAS</h3>
        <p className="my-3">Você não pode acessar ou utilizar os Serviços para qualquer finalidade que não seja aquela para a qual eles são disponibilizados por nós. Os Serviços não devem ser usados em conexão com quaisquer atividades comerciais, exceto aquelas expressamente autorizadas por nós.</p>

        <p>Ao utilizar os Serviços, você concorda em NÃO:</p>
        <ul className="list-disc list-inside">
          <li>Coletar sistematicamente dados ou outro conteúdo dos Serviços para criar ou compilar, direta ou indiretamente, uma coleção, banco de dados ou diretório sem nossa autorização por escrito.</li>
          <li>Enganar, fraudar ou induzir em erro nós ou outros usuários, especialmente com o intuito de obter informações sensíveis de contas, como senhas.</li>
          <li>Contornar, desabilitar ou interferir de qualquer forma com recursos de segurança dos Serviços.</li>
          <li>Difamar, denegrir ou causar dano à nossa imagem ou aos Serviços, segundo nosso julgamento.</li>
          <li>Utilizar informações obtidas dos Serviços para assediar, abusar ou prejudicar terceiros.</li>
          <li>Fazer uso indevido do nosso suporte ou enviar denúncias falsas de conduta imprópria.</li>
          <li>Utilizar os Serviços de forma contrária a qualquer lei ou norma vigente.</li>
          <li>Realizar enquadramentos (framing) ou links não autorizados para os Serviços.</li>
          <li>Carregar ou transmitir vírus, cavalos de Troia, spams, letras maiúsculas excessivas ou qualquer outro material que interfira no uso normal dos Serviços.</li>
          <li>Fazer uso automatizado dos Serviços, como uso de scripts, robôs ou ferramentas de extração de dados.</li>
          <li>Remover avisos de direitos autorais ou de propriedade de qualquer Conteúdo.</li>
          <li>Usurpar identidade de outro usuário ou utilizar login alheio.</li>
          <li>Enviar qualquer material que atue como mecanismo de coleta de informações, como pixel 1x1, cookies ou "spyware".</li>
          <li>Interferir ou sobrecarregar os Serviços ou redes associadas.</li>
          <li>Assediar, incomodar ou ameaçar nossos colaboradores ou representantes.</li>
          <li>Tentar burlar medidas destinadas a restringir o acesso aos Serviços.</li>
          <li>Copiar ou adaptar qualquer parte do código dos Serviços.</li>
          <li>Decifrar, descompilar ou fazer engenharia reversa do software dos Serviços, salvo se permitido por lei.</li>
          <li>Usar ou distribuir qualquer sistema automatizado, como scraper ou leitor offline, sem autorização.</li>
          <li>Utilizar agente de compras para efetuar pedidos nos Serviços.</li>
          <li>Coletar nomes de usuários e e-mails para envio de mensagens indesejadas ou criar contas de forma automatizada ou fraudulenta.</li>
          <li>Utilizar os Serviços para concorrer conosco ou com fins comerciais não autorizados.</li>
          <li>Anunciar ou vender bens e serviços por meio dos Serviços.</li>
          <li>Vender ou transferir seu perfil a terceiros.</li>
        </ul>

        <h3 className="my-3">8. CONTRIBUIÇÕES GERADAS PELO USUÁRIO</h3>
        <p className="my-3">
          Os Serviços não oferecem funcionalidade para envio de conteúdo por parte do usuário. Entretanto, podemos oferecer a possibilidade de criar, enviar, publicar ou exibir conteúdo para nós ou por meio dos Serviços, como textos, vídeos, áudios, comentários, sugestões, informações pessoais ou outros materiais ("Contribuições"). Essas Contribuições podem ser visíveis a outros usuários ou em sites de terceiros. Ao enviar qualquer Contribuição, você declara e garante que:
        </p>
        <ul className="list-disc list-inside">
          <li>A criação, distribuição, exibição ou cópia da sua Contribuição não infringe direitos de terceiros.</li>
          <li>Você possui ou tem as permissões legais para autorizar o uso da Contribuição pelos Serviços.</li>
          <li>Você tem consentimento por escrito de qualquer pessoa identificável na sua Contribuição.</li>
          <li>Suas Contribuições não são falsas, enganosas ou imprecisas.</li>
          <li>Não constituem publicidade não solicitada ou material promocional (spam, pirâmide, correntes).</li>
          <li>Não são obscenas, violentas, ofensivas ou de qualquer forma inaceitáveis.</li>
          <li>Não ridicularizam, intimidam ou abusam de ninguém.</li>
          <li>Não violam leis aplicáveis, nem direitos de privacidade ou imagem de terceiros.</li>
          <li>Não contêm material relacionado a pornografia infantil ou que coloque menores em risco.</li>
          <li>Não incluem comentários ofensivos relacionados a raça, origem, gênero ou deficiência.</li>
          <li>Não violam nenhuma cláusula destes Termos Legais ou de qualquer lei aplicável.</li>
        </ul>
        <p className="my-3">
          Qualquer uso dos Serviços em desacordo com os itens acima poderá resultar na suspensão ou encerramento da sua conta.
        </p>

        <h3 className="my-3">9. LICENÇA SOBRE CONTRIBUIÇÕES</h3>
        <p className="my-3">Você e os Serviços concordam que podemos acessar, armazenar, processar e utilizar qualquer informação e dado pessoal que você forneça, conforme os termos da Política de Privacidade e suas configurações.</p>

        <p className="my-3">Ao enviar sugestões ou feedback sobre os Serviços, você concorda que poderemos utilizá-los livremente para qualquer finalidade, sem compensação.</p>

        <p className="my-3">Não reivindicamos a propriedade das suas Contribuições. Você mantém todos os direitos sobre elas, inclusive de propriedade intelectual. Não nos responsabilizamos por declarações feitas por você em qualquer área dos Serviços. Você é o único responsável por suas Contribuições e concorda em nos isentar de qualquer responsabilidade, abstendo-se de nos acionar judicialmente por esse motivo.</p>

        <h3 className="my-3">10. REDES SOCIAIS</h3>
        <p className="my-3">
          Como parte da funcionalidade dos Serviços, você pode vincular sua conta a contas online que possui com terceiros (cada uma, uma "Conta de Terceiros") fornecendo suas credenciais ou permitindo que acessemos sua Conta de Terceiros conforme permitido pelos termos aplicáveis de cada provedor. Você declara que tem o direito de nos conceder esse acesso sem violar regras contratuais, sem custos adicionais e sem nos impor limitações de uso.
        </p>
        <p className="my-3">
          Ao nos permitir acessar qualquer Conta de Terceiros, você entende que: (1) podemos acessar, disponibilizar e armazenar conteúdos que você tenha fornecido ou armazenado nessa conta, inclusive listas de contatos, tornando-os acessíveis pelos Serviços; (2) poderemos enviar e receber informações adicionais conforme notificado no momento da vinculação. Dependendo das suas configurações de privacidade, informações pessoais postadas nessas contas podem se tornar acessíveis nos Serviços. Caso a Conta de Terceiros se torne indisponível ou o acesso seja bloqueado, esse conteúdo também poderá deixar de estar disponível.
        </p>
        <p className="my-3">
          Você pode desativar a conexão a qualquer momento por meio das configurações da conta ou entrando em contato conosco. Tentaremos excluir todos os dados armazenados provenientes dessa conta, com exceção do nome de usuário e da foto de perfil que tenham sido associados à sua conta.
        </p>
        <p className="my-3">
          OBSERVAÇÃO: Seu relacionamento com os provedores de serviços das Contas de Terceiros é regido exclusivamente pelos seus próprios contratos com esses provedores. Não analisamos o conteúdo dessas redes sociais quanto à precisão ou legalidade e não nos responsabilizamos por ele.
        </p>

        <h3 className="my-3">11. SITES E CONTEÚDOS DE TERCEIROS</h3>
        <p className="my-3">
          Os Serviços podem conter links para outros sites ("Sites de Terceiros") e conteúdos como textos, imagens, vídeos, aplicativos ou softwares pertencentes a terceiros ("Conteúdos de Terceiros"). Esses elementos não são verificados ou monitorados por nós quanto à precisão, adequação ou integridade. Não nos responsabilizamos por quaisquer Sites ou Conteúdos de Terceiros acessados pelos Serviços, incluindo suas práticas, opiniões ou políticas de privacidade.
        </p>
        <p className="my-3">
          A inclusão, o link ou a disponibilização de qualquer Conteúdo de Terceiros não implica nossa aprovação. Se decidir acessá-los, você o faz por sua conta e risco, devendo consultar os termos e políticas desses sites. Compras feitas por meio desses sites são exclusivamente entre você e o terceiro. Não endossamos produtos ou serviços anunciados nesses canais e não nos responsabilizamos por prejuízos decorrentes dessas transações.
        </p>

        <h3 className="my-3">12. GERENCIAMENTO DOS SERVIÇOS</h3>
        <p className="my-3">
          Reservamo-nos o direito, mas não a obrigação, de: (1) monitorar os Serviços quanto a violações destes Termos; (2) tomar medidas legais contra quem os violar, incluindo comunicar às autoridades; (3) restringir ou desabilitar qualquer conteúdo que considerarmos inadequado; (4) excluir arquivos que sejam excessivos ou onerem nossos sistemas; e (5) administrar os Serviços de forma a proteger nossos direitos e garantir seu funcionamento adequado.
        </p>

        <h3 className="my-3">13. POLÍTICA DE PRIVACIDADE</h3>
        <p className="my-3">
          Nos importamos com sua privacidade e segurança. Leia nossa Política de Privacidade: <Link href="/agreements/privacy-policy" target="_blank">https://systatus.live/agreements/privacy-policy</Link>. Ao usar os Serviços, você concorda com essa política, que está incorporada a estes Termos. Os Serviços são hospedados no Brasil e nos Estados Unidos. Se você acessá-los de outra região com leis diferentes, ao continuar a usá-los, você concorda com a transferência e o processamento dos seus dados nessas localidades.
        </p>

        <h3 className="my-3">14. VIGÊNCIA E RESCISÃO</h3>
        <p className="my-3">
          Estes Termos permanecerão em vigor enquanto você usar os Serviços. SEM PREJUÍZO DE OUTROS TERMOS, PODEMOS, A NOSSO CRITÉRIO EXCLUSIVO, SEM AVISO PRÉVIO, BLOQUEAR O ACESSO A QUALQUER PESSOA, POR QUALQUER MOTIVO, INCLUINDO VIOLAÇÃO DESTES TERMOS OU DA LEI. Podemos encerrar sua conta e remover qualquer conteúdo a qualquer momento.
        </p>
        <p className="my-3">
          Se sua conta for encerrada, você não poderá criar outra, seja em seu nome, nome falso, ou de terceiros. Além disso, poderemos tomar medidas legais cabíveis, incluindo ação judicial ou medidas cautelares.
        </p>

        <h3 className="my-3">15. MODIFICAÇÕES E INTERRUPÇÕES</h3>
        <p className="my-3">
          Podemos alterar, suspender ou remover partes dos Serviços a qualquer momento, sem aviso. Não somos obrigados a manter informações atualizadas. Não nos responsabilizamos por alterações, interrupções ou indisponibilidades.
        </p>
        <p className="my-3">
          Não garantimos que os Serviços estarão sempre disponíveis. Problemas técnicos ou manutenções podem causar interrupções. Você concorda que não somos responsáveis por perdas ou danos decorrentes da indisponibilidade. Nada nestes Termos obriga a manutenção ou atualização contínua dos Serviços.
        </p>

        <h3 className="my-3">16. LEI APLICÁVEL</h3>
        <p className="my-3">
          Estes Termos serão regidos pelas leis do Brasil. ARTUR MIGUEL ROCHA DESENVOLVIMENTO DE SOFTWARE e você concordam com a jurisdição exclusiva dos tribunais brasileiros para resolver qualquer disputa relacionada a estes Termos.
        </p>

        <h3 className="my-3">17. RESOLUÇÃO DE CONFLITOS</h3>
        <p className="my-3">
          Você concorda em submeter todas as disputas decorrentes destes Termos à jurisdição dos tribunais brasileiros. A ARTUR MIGUEL ROCHA DESENVOLVIMENTO DE SOFTWARE também poderá atuar em sua localidade ou sede, se aplicável.
        </p>

        <h3 className="my-3">18. CORREÇÕES</h3>
        <p className="my-3">
          As informações nos Serviços podem conter erros ou omissões, como descrições, preços e disponibilidade. Reservamo-nos o direito de corrigir qualquer erro ou atualizar as informações a qualquer momento, sem aviso prévio.
        </p>

        <h3 className="my-3">19. ISENÇÃO DE RESPONSABILIDADE</h3>
        <p className="my-3">
          OS SERVIÇOS SÃO FORNECIDOS "NO ESTADO EM QUE SE ENCONTRAM". VOCÊ CONCORDA QUE O USO É POR SUA CONTA E RISCO. NA MÁXIMA EXTENSÃO PERMITIDA PELA LEI, ISENTAMO-NOS DE TODAS AS GARANTIAS, INCLUINDO COMERCIALIZAÇÃO, ADEQUAÇÃO E NÃO INFRAÇÃO. NÃO NOS RESPONSABILIZAMOS POR: (1) ERROS OU IMPRECISÕES; (2) DANOS PESSOAIS OU MATERIAIS; (3) ACESSO NÃO AUTORIZADO A DADOS; (4) INTERRUPÇÕES; (5) VÍRUS OU MALWARE TRANSMITIDOS POR TERCEIROS; (6) ERROS EM CONTEÚDOS OU DANOS DECORRENTES DO USO. NÃO GARANTIMOS PRODUTOS OU SERVIÇOS DE TERCEIROS NEM NOS RESPONSABILIZAMOS POR TRANSAÇÕES ENTRE VOCÊ E TAIS TERCEIROS.
        </p>

        <h3 className="my-3">20. LIMITAÇÃO DE RESPONSABILIDADE</h3>
        <p className="my-3">
          EM NENHUMA HIPÓTESE SEREMOS RESPONSÁVEIS POR DANOS DIRETOS, INDIRETOS, LUCROS CESSANTES, PERDA DE DADOS OU OUTROS PREJUÍZOS DECORRENTES DO USO DOS SERVIÇOS, MESMO QUE TENHAMOS SIDO ADVERTIDOS SOBRE A POSSIBILIDADE DE TAIS DANOS.
        </p>

        <h3 className="my-3">21. INDENIZAÇÃO</h3>
        <p className="my-3">
          Você concorda em nos indenizar, incluindo nossos afiliados e representantes, contra qualquer perda, dano, responsabilidade, ou demanda resultante de: (1) uso dos Serviços; (2) violação destes Termos; (3) violação de direitos de terceiros; (4) atos prejudiciais a outros usuários. Reservamo-nos o direito de assumir a defesa em tais casos e você concorda em cooperar conosco.
        </p>

        <h3 className="my-3">22. DADOS DO USUÁRIO</h3>
        <p className="my-3">
          Manteremos certos dados transmitidos aos Serviços para fins operacionais. Embora realizemos backups regulares, você é o único responsável pelos dados que transmite. Não nos responsabilizamos por perdas ou corrupção de dados.
        </p>

        <h3 className="my-3">23. COMUNICAÇÕES, TRANSAÇÕES E ASSINATURAS ELETRÔNICAS</h3>
        <p className="my-3">
          Ao visitar os Serviços, enviar e-mails ou preencher formulários, você está se comunicando eletronicamente e consente em receber comunicações da mesma forma. Concorda com contratos e assinaturas eletrônicas e renuncia a exigências legais de documentos físicos ou assinaturas originais.
        </p>

        <h3 className="my-3">24. DISPOSIÇÕES GERAIS</h3>
        <p className="my-3">
          Estes Termos e quaisquer políticas publicadas constituem o acordo integral entre você e nós. Nossa omissão de qualquer direito não implica renúncia. Podemos ceder nossos direitos a qualquer momento. Não nos responsabilizamos por eventos fora do nosso controle. Se qualquer cláusula for considerada inválida, o restante permanecerá válido. Nada nestes Termos cria vínculo de parceria, agência ou emprego entre as partes.
        </p>

        <h3 className="my-3">25. FALE CONOSCO</h3>
        <p className="my-3">
          Para esclarecer dúvidas ou registrar reclamações sobre os Serviços, entre em contato conosco:
        </p>
        <p>ARTUR MIGUEL ROCHA DESENVOLVIMENTO DE SOFTWARE - CNPJ 43.682.698/0001-85</p>
        <p>Endereço: Av. Anselmo Alves dos Santos, 1076 - loja 01, CXPST 98, Uberlândia, Minas Gerais, 38408-097, Brasil</p>
        <p>E-mail: {supportMail}</p>
      </div>
    </>
  );
}