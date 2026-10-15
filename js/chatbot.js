/**
 * @file
 * Ask Croydon Council chatbot (Bot Framework Web Chat).
 *
 * Ported from the production block body script into a Drupal behavior.
 */
(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.localgovBaseCroydonChatbot = {
    attach(context) {
      once('localgov-base-croydon-chatbot', 'body', context === document ? context : document).forEach(() => {
        let chatbotHasInit = false;

        const styleOptions = {
          transitionDuration: '0s',
          hideUploadButton: true,
          hideTelephoneKeypadButton: true,
          bubbleBackground: '#F0F0F0',
          bubbleBorderColor: '#FFFFFF',
          bubbleBorderRadius: 12,
          bubbleBorderWidth: 0,
          bubbleNubOffset: 0,
          bubbleNubSize: 10,
          bubbleFromUserBackground: '#F8EEF8',
          bubbleFromUserBorderColor: '#F8EEF8',
          bubbleFromUserBorderRadius: 12,
          bubbleFromUserBorderWidth: 2,
          bubbleFromUserNubOffset: 0,
          bubbleFromUserNubSize: 10,
          bubbleFromUserTextColor: 'Black',
          bubbleMaxWidth: '85%',
          avatarBorderRadius: '50%',
          avatarSize: 40,
          botAvatarBackgroundColor: '#880088',
          botAvatarImage: '/themes/contrib/localgov_base_croydon/assets/img/robot-outline.svg',
          botAvatarInitials: 'CC',
          showAvatarInGroup: 'status',
          connectivityTextSize: '75%',
          failedConnectivity: '#C50F1F',
          slowConnectivity: '#EAA300',
          notificationText: '#5E5E5E',
          slowConnectionAfter: 15000,
          emojiSet: true,
          hideSendBox: false,
          microphoneButtonColorOnDictate: '#F33',
          sendBoxBackground: '#FFFFFF',
          uploadMultiple: true,
          sendAttachmentOn: 'send',
          sendBoxButtonColor: '#FFFFFF',
          sendBoxButtonShadeColor: '#77bb55',
          sendBoxButtonColorOnActive: '#121212',
          sendBoxButtonShadeColorOnActive: '#FFBB00',
          sendBoxButtonColorOnDisabled: '#FFFFFF',
          sendBoxButtonShadeColorOnDisabled: '#A0A0A0',
          sendBoxButtonColorOnFocus: '#121212',
          sendBoxButtonShadeColorOnFocus: '#FFBB00',
          sendBoxButtonColorOnHover: '#FFFFFF',
          sendBoxButtonShadeColorOnHover: '#540055',
          sendBoxButtonShadeBorderRadius: 0,
          sendBoxButtonShadeInset: 2,
          sendBoxButtonKeyboardFocusIndicatorBorderColor: '#FFBB00',
          sendBoxButtonKeyboardFocusIndicatorBorderRadius: 0,
          sendBoxButtonKeyboardFocusIndicatorBorderStyle: 'solid',
          sendBoxButtonKeyboardFocusIndicatorBorderWidth: 2,
          sendBoxButtonKeyboardFocusIndicatorInset: 0,
          sendBoxDisabledTextColor: '#FFFFFF',
          sendBoxHeight: 40,
          sendBoxMaxHeight: 200,
          sendBoxTextColor: 'Black',
          scrollToEndButtonBehavior: false,
          autoScrollSnapOnActivity: true,
          autoScrollSnapOnActivityOffset: 1,
          autoScrollSnapOnPage: false,
          autoScrollSnapOnPageOffset: 1,
        };

        async function initChatbot(webchat) {
          if (chatbotHasInit) {
            return;
          }

          chatbotHasInit = true;

          const TOKEN_URL = new URL('https://chat.croydon.gov.uk/powervirtualagents/botsbyschema/cr578_agent/directline/token?api-version=2022-03-01-preview');
          const locale = document.documentElement.lang || 'en';
          const apiVersion = TOKEN_URL.searchParams.get('api-version');

          try {
            const [directLineURL, token] = await Promise.all([
              fetch(new URL(`/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`, TOKEN_URL))
                .then((r) => (r.ok ? r.json() : Promise.reject('Failed to retrieve regional channel settings.')))
                .then(({ channelUrlsById: { directline } }) => directline),
              fetch(TOKEN_URL)
                .then((r) => (r.ok ? r.json() : Promise.reject('Failed to retrieve Direct Line token.')))
                .then(({ token: directLineToken }) => directLineToken),
            ]);

            const directLine = WebChat.createDirectLine({
              domain: new URL('v3/directline', directLineURL),
              token,
            });

            const subscription = directLine.connectionStatus$.subscribe({
              next(value) {
                if (value === 2) {
                  directLine.postActivity({
                    localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale,
                    name: 'startConversation',
                    type: 'event',
                  }).subscribe();
                  subscription.unsubscribe();
                }
              },
            });

            window.WebChat.renderWebChat({ directLine, locale, styleOptions }, webchat);

            // Android keyboard fix: scroll input into view when focused
            setTimeout(() => {
              const sendBoxInput = webchat.querySelector('.webchat__send-box-text-box__input');
              if (sendBoxInput) {
                sendBoxInput.addEventListener('focus', function () {
                  setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 300);
                });
              }
            }, 1000);
          }
          catch (error) {
            webchat.innerHTML = '<div style="padding: 20px; text-align: center; color: #C50F1F;">Unable to start chat. Please refresh the page and try again.</div>';
          }
        }

        const chatContainer = document.querySelector('.js-chatbot__chat-container');
        const chatbuttonContainer = document.querySelector('.chatbot-button__container');
        const chatContent = document.querySelector('.js-chatbot__chat-content');
        const chatMin = document.querySelector('.chatbot__min');

        if (!chatContainer || !chatbuttonContainer || !chatContent) {
          return;
        }

        function waitAndFocus(maxAttempts = 20, interval = 200) {
          let attempts = 0;

          const tryFocus = () => {
            attempts++;
            const markdown = document.querySelector('.webchat__render-markdown');
            const sendBox = document.querySelector('.webchat__send-box-text-box__input');

            if (markdown) {
              markdown.focus();
              return true;
            }
            if (sendBox) {
              sendBox.focus();
              return true;
            }
            if (attempts < maxAttempts) {
              setTimeout(tryFocus, interval);
            }
          };

          setTimeout(tryFocus, 300);
        }

        // Attach open handler to all open buttons
        document.querySelectorAll('.js-chatbot__open-button').forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            chatContainer.style.display = 'flex';
            chatbuttonContainer.style.display = 'none';
            initChatbot(chatContent);
            waitAndFocus();
          });
        });

        // Attach terminate handler to all terminate buttons
        document.querySelectorAll('.js-chatbot__terminate-button').forEach((button) => {
          button.addEventListener('click', () => {
            if (confirm('Are you sure you want to close and delete all chat messages?')) {
              window.location.reload();
            }
          });
        });

        // Attach minimise handler to all minimise buttons
        document.querySelectorAll('.js-chatbot__minimise-button').forEach((button) => {
          button.addEventListener('click', () => {
            chatContainer.style.display = 'none';
            // Clear inline display so CSS column layout (Hide below FAB) applies.
            chatbuttonContainer.style.display = '';
          });
        });

        if (chatMin) {
          chatMin.addEventListener('click', () => {
            chatbuttonContainer.classList.add('chatbot__min-toggle');
            chatMin.style.display = 'none';

            try {
              sessionStorage.setItem('chatbotMinimised', 'true');
            }
            catch (e) {}
          });
        }

        function loadChatbotState() {
          try {
            if (sessionStorage.getItem('chatbotMinimised') === 'true') {
              chatbuttonContainer.classList.add('chatbot__min-toggle');
              if (chatMin) {
                chatMin.style.display = 'none';
              }
            }
          }
          catch (e) {}
        }

        loadChatbotState();

        document.addEventListener('visibilitychange', () => {
          if (!document.hidden && chatContainer.style.display === 'flex') {
            waitAndFocus(5, 500);
          }
        });
      });
    },
  };
})(Drupal, once);
