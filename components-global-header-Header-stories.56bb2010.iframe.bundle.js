"use strict";(self.webpackChunk_kyndryl_design_system_shidoka_applications=self.webpackChunk_kyndryl_design_system_shidoka_applications||[]).push([[2693],{"./src/components/global/header/Header.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Header:()=>Header,WithEverything:()=>WithEverything,WithFlyouts:()=>WithFlyouts,WithNav:()=>WithNav,WithNotificationPanel:()=>WithNotificationPanel,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var lit__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/lit/index.js"),_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),_carbon_icons_es_user_avatar_20__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./src/components/global/header/index.ts"),__webpack_require__("./node_modules/@kyndryl-design-system/shidoka-foundation/components/icon/index.js"),__webpack_require__("./node_modules/@kyndryl-design-system/shidoka-foundation/components/button/index.js"),__webpack_require__("./node_modules/@carbon/icons/es/user--avatar/20.js")),_carbon_icons_es_help_20__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@carbon/icons/es/help/20.js"),_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@carbon/icons/es/circle-stroke/index.js"),_carbon_icons_es_notification_new_20__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/@carbon/icons/es/notification--new/20.js"),_carbon_icons_es_settings_20__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/@carbon/icons/es/settings/20.js");__webpack_require__("./src/components/reusable/notification/index.ts"),__webpack_require__("./src/components/reusable/overflowMenu/index.ts");const __WEBPACK_DEFAULT_EXPORT__={title:"Global Components/Header",component:"kyn-header",subcomponents:{"kyn-header-nav":"kyn-header-nav","kyn-header-link":"kyn-header-link","kyn-header-category":"kyn-header-category","kyn-header-divider":"kyn-header-divider","kyn-header-flyouts":"kyn-header-flyouts","kyn-header-flyout":"kyn-header-flyout","kyn-header-user-profile":"kyn-header-user-profile","kyn-header-notification-panel":"kyn-header-notification-panel"},decorators:[story=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
        <div
          style="height: 100vh; min-height: 250px; transform: translate3d(0,0,0); margin: var(--kd-negative-page-gutter);"
        >
          ${story()}
        </div>
      `],parameters:{design:{type:"figma",url:"https://www.figma.com/file/A13iBXmOmvxaJaBRWwqezd/Top-Nav-1.2?node-id=518%3A17470&mode=dev"}}},args={rootUrl:"/",appTitle:"Application"},notificationPanelArgs_panelTitle="Notifications (65)",notificationPanelArgs_panelFooterBtnText="See All Notifications",notificationPanelArgs_hidePanelFooter=!1,notificationTagStatusArr=[{tagStatus:"info"},{tagStatus:"warning"},{tagStatus:"success"},{tagStatus:"error"},{tagStatus:"default"}],Header={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}> </kyn-header>
  `},WithNav={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Link 1
        </kyn-header-link>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Link 4

          <div slot="links">
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
              Sub Link 1
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
              Sub Link 2
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
              Sub Link 3
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
              Sub Link 4
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
              Sub Link 5
            </kyn-header-link>
            <kyn-header-link slot="links" href="javascript:void(0)">
              <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
              Sub Link 6
            </kyn-header-link>
          </div>
        </kyn-header-link>
      </kyn-header-nav>
    </kyn-header>
  `},WithFlyouts={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-flyouts>
        <kyn-header-flyout label="Menu Label">
          <kd-icon .icon=${_carbon_icons_es_help_20__WEBPACK_IMPORTED_MODULE_6__.A} slot="button"></kd-icon>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <kd-icon slot="button" .icon=${_carbon_icons_es_user_avatar_20__WEBPACK_IMPORTED_MODULE_5__.A}></kd-icon>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example Link 2
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `},WithNotificationPanel={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy` <kyn-header
    rootUrl=${args.rootUrl}
    appTitle=${args.appTitle}
  >
    <kyn-header-flyouts>
      <kyn-header-flyout label="Notification" hideMenuLabel>
        <kd-icon slot="button" .icon=${_carbon_icons_es_notification_new_20__WEBPACK_IMPORTED_MODULE_8__.A}></kd-icon>
        <!-- Notification panel inside <kyn-header-flyout></kyn-header-flyout> -->
        <kyn-header-notification-panel
          panelTitle=${notificationPanelArgs_panelTitle}
          panelFooterBtnText=${notificationPanelArgs_panelFooterBtnText}
          ?hidePanelFooter=${notificationPanelArgs_hidePanelFooter}
          @on-footer-btn-click=${e=>(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__.XI)(e.type)(e)}
        >
          <kd-button
            slot="menu-slot"
            kind="tertiary"
            @click=${e=>(e=>{document.querySelectorAll("kyn-notification").forEach((notification=>{notification.unRead=!1})),(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__.XI)(e.type)(e)})(e)}
            >Mark all as Read</kd-button
          >
          <kd-button
            slot="menu-slot"
            kind="tertiary"
            @click=${e=>console.log(e)}
          >
            <kd-icon .icon=${_carbon_icons_es_settings_20__WEBPACK_IMPORTED_MODULE_9__.A}></kd-icon>
          </kd-button>

          <!-- Notification component inside notification panel -->
          ${notificationTagStatusArr.map((ele=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
              <kyn-notification
                notificationTitle="Notification Title"
                notificationSubtitle="Application or Service"
                timeStamp="2 mins ago"
                href="#"
                type="clickable"
                tagStatus=${ele.tagStatus}
                unRead
                @on-notification-click=${e=>(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__.XI)(e.type)(e)}
              >
                <kyn-overflow-menu
                  slot="actions"
                  anchorRight
                  @click=${e=>{e.preventDefault(),e.stopPropagation()}}
                >
                  <kyn-overflow-menu-item
                    @on-click=${e=>(e=>{(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__.XI)(e.type)(e)})(e)}
                    >Mark as Read</kyn-overflow-menu-item
                  >
                  <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>
                </kyn-overflow-menu>

                <div>
                  Message, this is an additional line Ipsum iMessage, Lorem
                  Ipsum is simply dummy and typesetting industry.
                </div>
              </kyn-notification>
            `))}
        </kyn-header-notification-panel>
      </kyn-header-flyout>

      <kyn-header-flyout label="Menu Label">
        <kd-icon .icon=${_carbon_icons_es_help_20__WEBPACK_IMPORTED_MODULE_6__.A} slot="button"></kd-icon>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Example 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Example 2
        </kyn-header-link>
      </kyn-header-flyout>

      <kyn-header-flyout label="Menu Label" hideMenuLabel>
        <kd-icon slot="button" .icon=${_carbon_icons_es_user_avatar_20__WEBPACK_IMPORTED_MODULE_5__.A}></kd-icon>

        <kyn-header-user-profile
          name="User Name"
          subtitle="Job Title"
          email="user@kyndryl.com"
          profileLink="#"
        >
          <img src="https://picsum.photos/id/237/112/112" />
        </kyn-header-user-profile>

        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Example Link 1
        </kyn-header-link>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Example Link 2
        </kyn-header-link>
      </kyn-header-flyout>
    </kyn-header-flyouts>
  </kyn-header>`},WithEverything={args,render:args=>lit__WEBPACK_IMPORTED_MODULE_0__.qy`
    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>
      <kyn-header-nav>
        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Link 1
        </kyn-header-link>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-category heading="Category">
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Link 2
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Link 3
          </kyn-header-link>
        </kyn-header-category>

        <kyn-header-divider></kyn-header-divider>

        <kyn-header-link href="javascript:void(0)">
          <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
          Link 4

          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Sub Link 1
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Sub Link 2
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Sub Link 3
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Sub Link 4
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Sub Link 5
          </kyn-header-link>
          <kyn-header-link slot="links" href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Sub Link 6
          </kyn-header-link>
        </kyn-header-link>
      </kyn-header-nav>

      <kd-button size="small">Button</kd-button>

      <kyn-header-flyouts>
        <kyn-header-flyout label="Menu Label">
          <kd-icon .icon=${_carbon_icons_es_help_20__WEBPACK_IMPORTED_MODULE_6__.A} slot="button"></kd-icon>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example 2
          </kyn-header-link>
        </kyn-header-flyout>

        <kyn-header-flyout label="Menu Label" hideMenuLabel>
          <kd-icon slot="button" .icon=${_carbon_icons_es_user_avatar_20__WEBPACK_IMPORTED_MODULE_5__.A}></kd-icon>

          <kyn-header-user-profile
            name="User Name"
            subtitle="Job Title"
            email="user@kyndryl.com"
            profileLink="#"
          >
            <img src="https://picsum.photos/id/237/112/112" />
          </kyn-header-user-profile>

          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example Link 1
          </kyn-header-link>
          <kyn-header-link href="javascript:void(0)">
            <kd-icon .icon=${_carbon_icons_es_circle_stroke__WEBPACK_IMPORTED_MODULE_7__.A}></kd-icon>
            Example Link 2
          </kyn-header-link>
        </kyn-header-flyout>
      </kyn-header-flyouts>
    </kyn-header>
  `};Header.parameters={...Header.parameters,docs:{...Header.parameters?.docs,source:{originalSource:"{\n  args,\n  render: args => html`\n    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}> </kyn-header>\n  `\n}",...Header.parameters?.docs?.source}}},WithNav.parameters={...WithNav.parameters,docs:{...WithNav.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => html`\n    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>\n      <kyn-header-nav>\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Link 1\n        </kyn-header-link>\n\n        <kyn-header-divider></kyn-header-divider>\n\n        <kyn-header-category heading="Category">\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Link 2\n          </kyn-header-link>\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Link 3\n          </kyn-header-link>\n        </kyn-header-category>\n\n        <kyn-header-divider></kyn-header-divider>\n\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Link 4\n\n          <div slot="links">\n            <kyn-header-link slot="links" href="javascript:void(0)">\n              <kd-icon .icon=${circleIcon}></kd-icon>\n              Sub Link 1\n            </kyn-header-link>\n            <kyn-header-link slot="links" href="javascript:void(0)">\n              <kd-icon .icon=${circleIcon}></kd-icon>\n              Sub Link 2\n            </kyn-header-link>\n            <kyn-header-link slot="links" href="javascript:void(0)">\n              <kd-icon .icon=${circleIcon}></kd-icon>\n              Sub Link 3\n            </kyn-header-link>\n            <kyn-header-link slot="links" href="javascript:void(0)">\n              <kd-icon .icon=${circleIcon}></kd-icon>\n              Sub Link 4\n            </kyn-header-link>\n            <kyn-header-link slot="links" href="javascript:void(0)">\n              <kd-icon .icon=${circleIcon}></kd-icon>\n              Sub Link 5\n            </kyn-header-link>\n            <kyn-header-link slot="links" href="javascript:void(0)">\n              <kd-icon .icon=${circleIcon}></kd-icon>\n              Sub Link 6\n            </kyn-header-link>\n          </div>\n        </kyn-header-link>\n      </kyn-header-nav>\n    </kyn-header>\n  `\n}',...WithNav.parameters?.docs?.source}}},WithFlyouts.parameters={...WithFlyouts.parameters,docs:{...WithFlyouts.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => html`\n    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>\n      <kyn-header-flyouts>\n        <kyn-header-flyout label="Menu Label">\n          <kd-icon .icon=${helpIcon} slot="button"></kd-icon>\n\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example 1\n          </kyn-header-link>\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example 2\n          </kyn-header-link>\n        </kyn-header-flyout>\n\n        <kyn-header-flyout label="Menu Label" hideMenuLabel>\n          <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>\n\n          <kyn-header-user-profile\n            name="User Name"\n            subtitle="Job Title"\n            email="user@kyndryl.com"\n            profileLink="#"\n          >\n            <img src="https://picsum.photos/id/237/112/112" />\n          </kyn-header-user-profile>\n\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example Link 1\n          </kyn-header-link>\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example Link 2\n          </kyn-header-link>\n        </kyn-header-flyout>\n      </kyn-header-flyouts>\n    </kyn-header>\n  `\n}',...WithFlyouts.parameters?.docs?.source}}},WithNotificationPanel.parameters={...WithNotificationPanel.parameters,docs:{...WithNotificationPanel.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => html` <kyn-header\n    rootUrl=${args.rootUrl}\n    appTitle=${args.appTitle}\n  >\n    <kyn-header-flyouts>\n      <kyn-header-flyout label="Notification" hideMenuLabel>\n        <kd-icon slot="button" .icon=${filledNotificationIcon}></kd-icon>\n        \x3c!-- Notification panel inside <kyn-header-flyout></kyn-header-flyout> --\x3e\n        <kyn-header-notification-panel\n          panelTitle=${notificationPanelArgs.panelTitle}\n          panelFooterBtnText=${notificationPanelArgs.panelFooterBtnText}\n          ?hidePanelFooter=${notificationPanelArgs.hidePanelFooter}\n          @on-footer-btn-click=${e => action(e.type)(e)}\n        >\n          <kd-button\n            slot="menu-slot"\n            kind="tertiary"\n            @click=${e => selectAllNotificationsAsRead(e)}\n            >Mark all as Read</kd-button\n          >\n          <kd-button\n            slot="menu-slot"\n            kind="tertiary"\n            @click=${e => console.log(e)}\n          >\n            <kd-icon .icon=${useSetingIcon}></kd-icon>\n          </kd-button>\n\n          \x3c!-- Notification component inside notification panel --\x3e\n          ${notificationTagStatusArr.map(ele => html`\n              <kyn-notification\n                notificationTitle="Notification Title"\n                notificationSubtitle="Application or Service"\n                timeStamp="2 mins ago"\n                href="#"\n                type="clickable"\n                tagStatus=${ele.tagStatus}\n                unRead\n                @on-notification-click=${e => action(e.type)(e)}\n              >\n                <kyn-overflow-menu\n                  slot="actions"\n                  anchorRight\n                  @click=${e => {\n    e.preventDefault();\n    e.stopPropagation();\n  }}\n                >\n                  <kyn-overflow-menu-item\n                    @on-click=${e => handleOverflowClick(e)}\n                    >Mark as Read</kyn-overflow-menu-item\n                  >\n                  <kyn-overflow-menu-item>View Details</kyn-overflow-menu-item>\n                </kyn-overflow-menu>\n\n                <div>\n                  Message, this is an additional line Ipsum iMessage, Lorem\n                  Ipsum is simply dummy and typesetting industry.\n                </div>\n              </kyn-notification>\n            `)}\n        </kyn-header-notification-panel>\n      </kyn-header-flyout>\n\n      <kyn-header-flyout label="Menu Label">\n        <kd-icon .icon=${helpIcon} slot="button"></kd-icon>\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Example 1\n        </kyn-header-link>\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Example 2\n        </kyn-header-link>\n      </kyn-header-flyout>\n\n      <kyn-header-flyout label="Menu Label" hideMenuLabel>\n        <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>\n\n        <kyn-header-user-profile\n          name="User Name"\n          subtitle="Job Title"\n          email="user@kyndryl.com"\n          profileLink="#"\n        >\n          <img src="https://picsum.photos/id/237/112/112" />\n        </kyn-header-user-profile>\n\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Example Link 1\n        </kyn-header-link>\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Example Link 2\n        </kyn-header-link>\n      </kyn-header-flyout>\n    </kyn-header-flyouts>\n  </kyn-header>`\n}',...WithNotificationPanel.parameters?.docs?.source}}},WithEverything.parameters={...WithEverything.parameters,docs:{...WithEverything.parameters?.docs,source:{originalSource:'{\n  args,\n  render: args => html`\n    <kyn-header rootUrl=${args.rootUrl} appTitle=${args.appTitle}>\n      <kyn-header-nav>\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Link 1\n        </kyn-header-link>\n\n        <kyn-header-divider></kyn-header-divider>\n\n        <kyn-header-category heading="Category">\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Link 2\n          </kyn-header-link>\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Link 3\n          </kyn-header-link>\n        </kyn-header-category>\n\n        <kyn-header-divider></kyn-header-divider>\n\n        <kyn-header-link href="javascript:void(0)">\n          <kd-icon .icon=${circleIcon}></kd-icon>\n          Link 4\n\n          <kyn-header-link slot="links" href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Sub Link 1\n          </kyn-header-link>\n          <kyn-header-link slot="links" href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Sub Link 2\n          </kyn-header-link>\n          <kyn-header-link slot="links" href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Sub Link 3\n          </kyn-header-link>\n          <kyn-header-link slot="links" href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Sub Link 4\n          </kyn-header-link>\n          <kyn-header-link slot="links" href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Sub Link 5\n          </kyn-header-link>\n          <kyn-header-link slot="links" href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Sub Link 6\n          </kyn-header-link>\n        </kyn-header-link>\n      </kyn-header-nav>\n\n      <kd-button size="small">Button</kd-button>\n\n      <kyn-header-flyouts>\n        <kyn-header-flyout label="Menu Label">\n          <kd-icon .icon=${helpIcon} slot="button"></kd-icon>\n\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example 1\n          </kyn-header-link>\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example 2\n          </kyn-header-link>\n        </kyn-header-flyout>\n\n        <kyn-header-flyout label="Menu Label" hideMenuLabel>\n          <kd-icon slot="button" .icon=${userAvatarIcon}></kd-icon>\n\n          <kyn-header-user-profile\n            name="User Name"\n            subtitle="Job Title"\n            email="user@kyndryl.com"\n            profileLink="#"\n          >\n            <img src="https://picsum.photos/id/237/112/112" />\n          </kyn-header-user-profile>\n\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example Link 1\n          </kyn-header-link>\n          <kyn-header-link href="javascript:void(0)">\n            <kd-icon .icon=${circleIcon}></kd-icon>\n            Example Link 2\n          </kyn-header-link>\n        </kyn-header-flyout>\n      </kyn-header-flyouts>\n    </kyn-header>\n  `\n}',...WithEverything.parameters?.docs?.source}}};const __namedExportsOrder=["Header","WithNav","WithFlyouts","WithNotificationPanel","WithEverything"]}}]);
//# sourceMappingURL=components-global-header-Header-stories.56bb2010.iframe.bundle.js.map