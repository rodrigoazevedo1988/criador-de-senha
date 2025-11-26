# 🔐 Gerador de Senhas PWA

Um gerador de senhas moderno e completo desenvolvido como Progressive Web App (PWA) com recursos avançados de segurança e experiência de usuário premium.

## 📱 Demonstração

🌐 **Acesse a aplicação**: [https://srgatocoursesonline.github.io/gerador-de-senhas](https://srgatocoursesonline.github.io/gerador-de-senhas)

> **💡 Dica**: Instale como PWA para experiência completa de aplicativo nativo!

## ✨ Características Principais

### 🔒 Segurança Avançada
- **Geração Criptograficamente Segura** usando `crypto.getRandomValues()`
- **Indicador Visual de Força** da senha em tempo real
- **Funcionalidade Offline Completa** - gere senhas sem internet
- **Armazenamento Local Seguro** com criptografia opcional

### 🎨 Interface Moderna
- **Design Responsivo** para mobile, tablet e desktop
- **Sistema de Temas** - modo claro e escuro com detecção automática
- **Animações Suaves** e transições fluidas
- **Notificações Toast** elegantes
- **Splash Screen** para experiência nativa

### 📚 Gestão Inteligente
- **Histórico de Senhas** com busca e favoritos
- **Sistema de Presets** para diferentes necessidades
- **Exportação Múltipla** (TXT, CSV, JSON)
- **Presets Predefinidos** (Login, WiFi, Banco, Redes Sociais)

### ⚡ Performance Premium
- **PWA Otimizado** com Service Worker
- **Cache Inteligente** para carregamento instantâneo
- **Lazy Loading** e otimizações de memória
- **Atalhos de Teclado** para produtividade

## 🚀 Recursos PWA

### ✅ Requisitos Básicos PWA
- [x] **Manifest.json** completo com ícones e configurações
- [x] **Service Worker** para cache offline e sincronização
- [x] **HTTPS/Localhost** para instalação segura
- [x] **Design Responsivo** em todos os tamanhos de tela
- [x] **Ícones Adaptativos** em múltiplos tamanhos

### 🎯 Recursos Avançados
- [x] **Instalação Nativa** - funciona como app do sistema
- [x] **Funcionamento Offline** - todas as funcionalidades sem internet
- [x] **Shortcuts de App** - acesso rápido a funcionalidades
- [x] **Tema Adaptativo** - segue preferências do sistema
- [x] **Atualizações Automáticas** com notificações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** semântico com acessibilidade
- **CSS3** moderno com variáveis e grid/flexbox
- **JavaScript ES6+** vanilla com módulos
- **Web APIs** (Service Worker, Cache API, Crypto API)

### PWA
- **Manifest.json** para configuração de app
- **Service Worker** para cache e offline
- **Cache API** para armazenamento inteligente
- **IndexedDB/localStorage** para persistência

### Ferramentas
- **Responsive Design** mobile-first
- **CSS Custom Properties** para temas
- **Performance Optimizations** (lazy loading, debounce)
- **Accessibility** (ARIA, keyboard navigation)

## 📋 Funcionalidades Detalhadas

### 🔐 Geração de Senhas
```javascript
// Configurações disponíveis
- Tamanho: 6-30 caracteres
- Maiúsculas (A-Z)
- Minúsculas (a-z)  
- Números (0-9)
- Símbolos (@#!%&*)
```

### 🎚️ Presets Inteligentes
- **🔑 Login Básico**: 12 chars, apenas letras e números
- **🛡️ Segurança Alta**: 20 chars, todos os tipos
- **📱 Redes Sociais**: 14 chars, sem símbolos especiais
- **🏦 Bancário**: 16 chars, alta segurança
- **📶 WiFi**: 24 chars, máxima segurança
- **➕ Personalizados**: crie seus próprios presets

### 📊 Sistema de Exportação
```
📄 TXT - Lista simples de senhas
📊 CSV - Planilha com metadados
💾 JSON - Dados estruturados completos
🔐 Criptografia - Proteção adicional opcional
```

### ⌨️ Atalhos de Teclado
- `Ctrl + G` - Gerar nova senha
- `Ctrl + C` - Copiar senha atual
- `Ctrl + H` - Abrir histórico
- `Ctrl + T` - Alternar tema
- `Esc` - Fechar modais

## 🚀 Instalação e Uso

### 💻 Uso Online
1. Acesse: [https://srgatocoursesonline.github.io/gerador-de-senhas](https://srgatocoursesonline.github.io/gerador-de-senhas)
2. Configure os parâmetros desejados
3. Clique em "🔐 Gerar Senha"
4. Use o botão de copiar para área de transferência

### 📱 Instalação como PWA

#### Chrome/Edge (Desktop)
1. Clique no ícone de instalação na barra de endereços
2. Ou vá em Menu → "Instalar Gerador de Senhas"
3. Confirme a instalação

#### Chrome (Android)
1. Toque em "Adicionar à tela inicial" no menu
2. Confirme a instalação
3. Use como app nativo

#### Safari (iOS)
1. Toque no botão Compartilhar
2. Selecione "Adicionar à Tela Inicial"
3. Confirme e nomeie o app

### 🔧 Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/srgatocoursesonline/gerador-de-senhas.git

# Entre no diretório
cd gerador-de-senhas

# Inicie servidor local
python -m http.server 3000
# ou
npx serve .

# Acesse http://localhost:3000
```

## 📁 Estrutura do Projeto

```
gerador-de-senhas/
├── 📄 index.html          # Estrutura principal HTML
├── 🎨 style.css           # Estilos e temas
├── ⚡ script.js           # Lógica da aplicação
├── 📱 manifest.json       # Configuração PWA
├── 🔧 sw.js              # Service Worker
├── 📚 PWA-TESTING-GUIDE.md # Guia de testes
├── 📖 README.md           # Este arquivo
└── 🗂️ icons/             # Ícones do PWA
    ├── icon-template.svg
    └── generate-icons.html
```

## 🧪 Testes e Qualidade

### ✅ Compatibilidade
- **Chrome** 80+ (Desktop/Mobile)
- **Firefox** 75+ (Desktop/Mobile)
- **Safari** 13+ (Desktop/Mobile)
- **Edge** 80+ (Desktop)

### 📊 Performance
- **Lighthouse Score**: 95+ PWA
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

### 🔧 Testes PWA
Consulte o [Guia de Testes PWA](PWA-TESTING-GUIDE.md) para instruções detalhadas de teste em diferentes dispositivos e navegadores.

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### 📝 Diretrizes de Contribuição
- Siga os padrões de código existentes
- Mantenha responsividade em todos os dispositivos
- Implemente testes para novas funcionalidades
- Documente mudanças significativas
- Garanta acessibilidade (ARIA, semântica)

## 📜 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🛡️ Segurança

- ✅ Geração criptograficamente segura
- ✅ Não envia dados para servidores externos
- ✅ Armazenamento local criptografado
- ✅ Funciona completamente offline
- ✅ Código aberto para auditoria

## 📞 Suporte

### 🐛 Reportar Bugs
Encontrou um problema? [Abra uma issue](https://github.com/srgatocoursesonline/gerador-de-senhas/issues/new) com:
- Descrição detalhada do problema
- Passos para reproduzir
- Navegador e versão
- Screenshots (se aplicável)

### 💡 Sugestões
Tem uma ideia? [Sugira uma feature](https://github.com/srgatocoursesonline/gerador-de-senhas/issues/new) ou contribua diretamente!

## 🎯 Roadmap

### 📅 Próximas Versões
- [ ] **Geração por Padrões** (regex customizado)
- [ ] **Integração com Gerenciadores de Senhas**
- [ ] **Modo Colaborativo** (compartilhamento seguro)
- [ ] **Análise de Senhas Vazadas** (API HaveIBeenPwned)
- [ ] **Backup na Nuvem** (opcional e criptografado)
- [ ] **Extensão de Navegador**

## 🏆 Reconhecimentos

Desenvolvido com ❤️ por [SR Gato Courses Online](https://github.com/srgatocoursesonline)

### 🙏 Agradecimentos
- Comunidade open source
- Feedback dos usuários
- Contribuidores do projeto

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela!**

[![GitHub Stars](https://img.shields.io/github/stars/srgatocoursesonline/gerador-de-senhas?style=social)](https://github.com/srgatocoursesonline/gerador-de-senhas/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/srgatocoursesonline/gerador-de-senhas?style=social)](https://github.com/srgatocoursesonline/gerador-de-senhas/network/members)

📱 **PWA Ready** | 🔒 **Crypto Secure** | ⚡ **High Performance** | 🎨 **Modern UI**

</div>