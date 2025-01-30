'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var DiscordianPlugin = /** @class */ (function (_super) {
    __extends(DiscordianPlugin, _super);
    function DiscordianPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // refresh function for when we change settings
        _this.refresh = function () {
            // re-load the style
            _this.updateStyle();
        };
        return _this;
    }
    DiscordianPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || {
                            hideVault: true,
                            hideTitleBar: true,
                            hideStatusBar: true,
                            originalMarkings: false,
                            relationLinesPreview: true,
                            prettyTasksEditor: true,
                            darkEnhance: false,
                            fontSizeNotes: 14,
                            fontSizeFileExplorer: 14,
                            writerMode: false,
                            paragraphFocusMode: false,
                            paragraphFocusFade: 75,
                            flatAndyMode: true,
                            readableLength: 45
                        };
                        this.addSettingTab(new DiscordianPluginSettingsTab(this.app, this));
                        this.addStyle();
                        this.addCommands();
                        this.refresh();
                        return [2 /*return*/];
                }
            });
        });
    };
    DiscordianPlugin.prototype.onunload = function () {
        this.removeStyle();
    };
    DiscordianPlugin.prototype.addCommands = function () {
        var _this = this;
        this.addCommand({
            id: 'toggle-discordian-writer-mode',
            name: 'Toggle Writer Mode',
            callback: function () {
                _this.settings.writerMode = !_this.settings.writerMode;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-flat-andy-mode',
            name: 'Toggle Flat Andy Mode',
            callback: function () {
                _this.settings.flatAndyMode = !_this.settings.flatAndyMode;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-paragraph-focus-mode',
            name: 'Toggle Paragraph Focus Mode',
            callback: function () {
                _this.settings.paragraphFocusMode = !_this.settings.paragraphFocusMode;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-discord-original-markings',
            name: 'Toggle Discord original markings',
            callback: function () {
                _this.settings.originalMarkings = !_this.settings.originalMarkings;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-relationship-lines-preview',
            name: 'Toggle relationship lines in Preview mode',
            callback: function () {
                _this.settings.relationLinesPreview = !_this.settings.relationLinesPreview;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-pretty-tasks-preview',
            name: 'Toggle Pretty Task Lists in Editor mode',
            callback: function () {
                _this.settings.prettyTasksEditor = !_this.settings.prettyTasksEditor;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-dark-enhance',
            name: 'Toggle Dark note headers',
            callback: function () {
                _this.settings.darkEnhance = !_this.settings.darkEnhance;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
    };
    // add the styling elements we need
    DiscordianPlugin.prototype.addStyle = function () {
        // add a css block for our settings-dependent styles
        var css = document.createElement('style');
        css.id = 'discordian-theme';
        document.getElementsByTagName("head")[0].appendChild(css);
        // add the main class
        document.body.classList.add('discordian-theme');
        document.body.classList.add('discordian-readable-length');
        document.body.classList.add('discordian-paragraph-focus-fade');
        // update the style with the settings-dependent styles
        this.updateStyle();
    };
    DiscordianPlugin.prototype.removeStyle = function () {
        var discordianClasses = [
            'discordian-theme',
            'discordian-writer-mode',
            'discordian-flat-andy-mode',
            'discordian-paragraph-focus',
            'discordian-paragraph-focus-fade',
            'discordian-readable-length',
            'discordian-font-size-notes',
            'discordian-font-size-file-explorer',
            'discordian-discord-markings',
            'discordian-rel-preview',
            'discordian-pretty-tasks-editor',
            'discordian-dark-enhance',
            'discordian-hide-vault',
            'discordian-hide-titlebar',
            'discordian-hide-statusbar'
        ];
        document.body.removeClasses(discordianClasses);
    };
    DiscordianPlugin.prototype.initStyles = function () {
        var discordianEl = document.getElementById('discordian-theme');
        if (discordianEl) {
            var len = this.settings.readableLength + 'rem';
            var fade = 100 - this.settings.paragraphFocusFade;
            var fontSizeNotes = this.settings.fontSizeNotes / 16 + 'rem';
            var fontSizeFileExplorer = this.settings.fontSizeFileExplorer / 16 + 'rem';
            var letterSpacingNotes = (this.settings.fontSizeNotes < 16 ? -0.2 : -0.4) + 'px';
            discordianEl.innerText = "\n                    body.discordian-theme {\n                        --readable-line-length:" + len + ";\n                        --paragraph-focus-fade: 0." + fade + ";\n                        --font-size-notes: " + fontSizeNotes + ";\n                        --font-size-file-explorer: " + fontSizeFileExplorer + ";\n                        --letter-spacing-notes: " + letterSpacingNotes + ";\n                    }\n                ";
        }
        else {
            throw "Could not find Discordian Theme";
        }
    };
    // update the styles (at the start, or as the result of a settings change)
    DiscordianPlugin.prototype.updateStyle = function () {
        document.body.classList.toggle('discordian-writer-mode', this.settings.writerMode);
        document.body.classList.toggle('discordian-flat-andy-mode', this.settings.flatAndyMode);
        document.body.classList.toggle('discordian-paragraph-focus', this.settings.paragraphFocusMode);
        document.body.classList.toggle('discordian-hide-vault', this.settings.hideVault);
        document.body.classList.toggle('discordian-hide-titlebar', this.settings.hideTitleBar);
        document.body.classList.toggle('discordian-hide-statusbar', this.settings.hideStatusBar);
        document.body.classList.toggle('discordian-original-markings', this.settings.originalMarkings);
        document.body.classList.toggle('discordian-rel-preview', this.settings.relationLinesPreview);
        document.body.classList.toggle('discordian-pretty-tasks-editor', this.settings.prettyTasksEditor);
        document.body.classList.toggle('discordian-dark-enhance', this.settings.darkEnhance);
        this.initStyles();
    };
    return DiscordianPlugin;
}(obsidian.Plugin));
var DiscordianPluginSettingsTab = /** @class */ (function (_super) {
    __extends(DiscordianPluginSettingsTab, _super);
    function DiscordianPluginSettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    DiscordianPluginSettingsTab.prototype.display = function () {
        var containerEl = this.containerEl;
        var settings = this.plugin.settings;
        containerEl.empty();
        this.addPluginDescription(containerEl);
        this.addPluginSettingsHeader(containerEl, 'Theme Settings');
        this.addWriterModeSettings(containerEl, settings);
        this.addFlatAndyModeSettings(containerEl, settings);
        this.addParagraphFocusModeSettings(containerEl, settings);
        this.addReadableLengthSettings(containerEl, settings);
        this.addOriginalMarkingsSettings(containerEl, settings);
        this.addRelationLinesPreviewSettings(containerEl, settings);
        this.addPrettyTasksEditorSettings(containerEl, settings);
        this.addDarkEnhanceSettings(containerEl, settings);
        this.addPluginSettingsSeparator(containerEl);
        this.addPluginSettingsHeader(containerEl, 'Fonts');
        this.addNotesFontSizeSettings(containerEl, settings);
        this.addFileExplorerFontSizeSettings(containerEl, settings);
        this.addPluginSettingsSeparator(containerEl);
        this.addPluginSettingsHeader(containerEl, 'If not using Hider plugin');
        this.addHideVaultSettings(containerEl, settings);
        this.addHideTitleBarSettings(containerEl, settings);
        this.addHideStatusBarSettings(containerEl, settings);
    };
    DiscordianPluginSettingsTab.prototype.addPluginDescription = function (containerEl) {
        var description = containerEl.createEl('div', { cls: 'plugin-description' });
        description.createEl('h3', { text: 'Thanks for using Discordian !' });
        description.createEl('p', { text: 'If you notice any issues, try to update to the latest version and reload Obsidian.' });
        description.createEl('p', { text: 'Otherwise feel free to bring it up on Github or better yet contribute a fix.' });
        description.createEl('a', {
            text: 'https://github.com/radekkozak/discordian/issues/',
            attr: { 'href': 'https://github.com/radekkozak/discordian/issues/', 'target': '_blank' }
        });
    };
    DiscordianPluginSettingsTab.prototype.addPluginSettingsHeader = function (containerEl, headerTitle) {
        containerEl.createEl('h4', { text: headerTitle });
    };
    DiscordianPluginSettingsTab.prototype.addPluginSettingsSeparator = function (containerEl) {
        containerEl.createEl('p', { text: '⊷', cls: 'plugin-description separator' });
    };
    DiscordianPluginSettingsTab.prototype.addWriterModeSettings = function (containerEl, settings) {
        var _this = this;
        var description = new DocumentFragment();
        description.appendText('Hides visual excess when sidebars are collapsed (accessible by hover)');
        description.createEl('br');
        description.appendText('NOTE : this setting will hide Status bar and Title bar ' +
            'regardless of their individual options');
        new obsidian.Setting(containerEl)
            .setName('Writer mode')
            .setDesc(description)
            .addToggle(function (toggle) { return toggle.setValue(settings.writerMode)
            .onChange(function (value) {
            settings.writerMode = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addFlatAndyModeSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Flat Andy Mode')
            .setDesc('Flatter notes stacking when in Andy Mode (no elevation shadow)')
            .addToggle(function (toggle) { return toggle.setValue(settings.flatAndyMode)
            .onChange(function (value) {
            settings.flatAndyMode = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addParagraphFocusModeSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Paragraph focus mode')
            .setDesc('This aims to imitate well-known iA Writer paragraph focus.')
            .addToggle(function (toggle) { return toggle.setValue(settings.paragraphFocusMode)
            .onChange(function (value) {
            settings.paragraphFocusMode = value;
            _this.plugin.saveData(settings);
            setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', !value);
            _this.plugin.refresh();
        }); });
        var nameFade = 'Paragraph Focus Mode fade ';
        var setting = new obsidian.Setting(containerEl)
            .setName(nameFade + '( = ' + settings.paragraphFocusFade + '% )')
            .setDesc('Amount of fade out when in Paragraph Focus Mode (default 75%)')
            .addSlider(function (slider) { return slider.setLimits(25, 90, 5)
            .setValue(settings.paragraphFocusFade)
            .onChange(function (value) {
            settings.paragraphFocusFade = value;
            setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', !value);
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(nameFade + '( = ' + settings.paragraphFocusFade + '% )');
        }); });
        setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', !settings.paragraphFocusMode);
    };
    DiscordianPluginSettingsTab.prototype.addReadableLengthSettings = function (containerEl, settings) {
        var _this = this;
        var readableLineLength = document.getElementsByClassName('is-readable-line-width');
        var name = 'Readable line length ';
        var setting = new obsidian.Setting(containerEl)
            .setName(name + '( = ' + settings.readableLength + 'rem )')
            .setDesc('Obsidian\'s Readable line length needs to be enabled (default 45 rem)')
            .addSlider(function (slider) { return slider.setLimits(45, 120, 5)
            .setValue(settings.readableLength)
            .onChange(function (value) {
            settings.readableLength = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(name + '( = ' + settings.readableLength + 'rem )');
        }); });
        setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', readableLineLength.length == 0);
    };
    DiscordianPluginSettingsTab.prototype.addOriginalMarkingsSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Discord original markings')
            .setDesc('Use Discord original markings such as bold, italics, inline code, quotes and so on')
            .addToggle(function (toggle) { return toggle.setValue(settings.originalMarkings)
            .onChange(function (value) {
            settings.originalMarkings = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addDarkEnhanceSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Dark note headers')
            .setDesc('Make note headers more prominent')
            .addToggle(function (toggle) { return toggle.setValue(settings.darkEnhance)
            .onChange(function (value) {
            settings.darkEnhance = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addRelationLinesPreviewSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Relationship lines in Preview mode')
            .setDesc('Show lines connecting related bullet points and task lists')
            .addToggle(function (toggle) { return toggle.setValue(settings.relationLinesPreview)
            .onChange(function (value) {
            settings.relationLinesPreview = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addPrettyTasksEditorSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Pretty Task Lists in Editor mode')
            .setDesc("HACKISH : please use both 'Smart indent lists' and 'Use tabs' options for best experience")
            .addToggle(function (toggle) { return toggle.setValue(settings.prettyTasksEditor)
            .onChange(function (value) {
            settings.prettyTasksEditor = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addNotesFontSizeSettings = function (containerEl, settings) {
        var _this = this;
        var name = 'Notes font size ';
        var setting = new obsidian.Setting(containerEl)
            .setName(name + '( = ' + settings.fontSizeNotes + 'px )')
            .setDesc('Used in editor/preview mode (default 14px)')
            .addSlider(function (slider) { return slider.setLimits(14, 22, 2)
            .setValue(settings.fontSizeNotes)
            .onChange(function (value) {
            settings.fontSizeNotes = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(name + '( = ' + value + 'px )');
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addFileExplorerFontSizeSettings = function (containerEl, settings) {
        var _this = this;
        var name = 'File Explorer font size ';
        var setting = new obsidian.Setting(containerEl)
            .setName(name + '( = ' + settings.fontSizeFileExplorer + 'px )')
            .setDesc('Used in File Explorer (default 14px)')
            .addSlider(function (slider) { return slider.setLimits(12, 18, 2)
            .setValue(settings.fontSizeFileExplorer)
            .onChange(function (value) {
            settings.fontSizeFileExplorer = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(name + '( = ' + value + 'px )');
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addHideVaultSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Hide vault name')
            .setDesc('Hides vault name in File Explorer')
            .addToggle(function (toggle) { return toggle.setValue(settings.hideVault)
            .onChange(function (value) {
            settings.hideVault = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addHideTitleBarSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Hide title bar')
            .setDesc('Hides main title bar (theme\'s default)')
            .addToggle(function (toggle) { return toggle.setValue(settings.hideTitleBar)
            .onChange(function (value) {
            settings.hideTitleBar = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addHideStatusBarSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Hide status bar')
            .setDesc('Hides status bar (theme\'s default)')
            .addToggle(function (toggle) { return toggle.setValue(settings.hideStatusBar)
            .onChange(function (value) {
            settings.hideStatusBar = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    return DiscordianPluginSettingsTab;
}(obsidian.PluginSettingTab));

module.exports = DiscordianPlugin;


/* nosourcemap */