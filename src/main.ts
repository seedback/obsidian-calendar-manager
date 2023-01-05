import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as CTE from 'CustomTagEngine/index'



// Remember to rename these classes and interfaces!

interface CalendarManagerSettings {
	jsonLocations: string;
}

const DEFAULT_SETTINGS: CalendarManagerSettings = {
	jsonLocations: 'default'
}

export default class CalendarManagerPlugin extends Plugin {
	settings: CalendarManagerSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SampleSettingTab(this.app, this));

		console.log("loaded calendar");
		this.addCommand({
			id: "test",
			name: "test",
			callback: () => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);

				console.log(view?.getMode());

				if (view?.getMode() == "preview") {

					let data = view?.getViewData();
					let tag = new CTE.CustomTag('<@', '@>');
					let tagHandler:CTE.CustomTagHandler = {
						verifier: (str:string) => {if(str === 'TEST'){return true;}return false;},
						callback: (str:string) => {return 'String has been replaced'}
					}

					console.log(data);

					data = CTE.replace_custom_tag_in_string(data, tag, [tagHandler]) || data;
					console.log(data);
					data = CTE.replace_all_custom_tags_in_string(data, tag, [tagHandler]);

					view.setViewData(data, false);
				}
			}
		});
	}

	onunload() {
		console.log("unloaded calendar");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

class SampleSettingTab extends PluginSettingTab {
	plugin: CalendarManagerPlugin;

	constructor(app: App, plugin: CalendarManagerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for Calendar Manager.' });

		new Setting(containerEl)
			.setName('Calendar JSON Location')
			.setDesc(
				createFragment((e) => {
					e.createEl('p', {
						text: 'Location of JSON file or files with calendar definition.'
					});
					e.createEl('p', {
						text: 'Each location is seperated with a semicolon.'
					});
					e.createEl('p', {
						text: 'The wildcard "*" can be used to include all files in a folder, these are all then expected to have the.'
					});
					e.createEl('p', {
						text: 'json extenstion\nThe wildcard "**" can be used to include any sub-folders, recursively.'
					});
				})
			)
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.jsonLocations)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.jsonLocations = value;
					await this.plugin.saveSettings();
				}));
	}
}
