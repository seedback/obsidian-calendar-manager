import { CalendarView, CALENDAR_VIEW_TYPE } from 'CalendarView';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, parseYaml, SectionCache } from 'obsidian';
import { Calendar} from 'types/calendar'
// import { CreateCalendar } from 'calendar'

interface CalendarManagerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CalendarManagerSettings = {
	mySetting: 'default'
}

// Stores all calendars during this session
const calendars = Array<Calendar>;

export default class CalendarManager extends Plugin {
	settings: CalendarManagerSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(CALENDAR_VIEW_TYPE, (leaf) => new CalendarView(leaf));
		this.addRibbonIcon('calendar-days', 'Open calendar view', (evt) => this.activateView() )

		// this.addCommand({
		// 	id: 'test',
		// 	name: 'Test',
		// 	callback: async () => {
		// 		const currentFile:TFile = app.workspace.getActiveFile() ?? new TFile;
		// 		const frontmatter = app.metadataCache.getFileCache(currentFile)?.frontmatter;
		// 		console.log(frontmatter);

		// 		if(frontmatter?.cm_calendar){
		// 			console.warn('suckies');
		// 			new Calendar(frontmatter.cm_calendar)
		// 		}
		// 		if(frontmatter?.cm_calendars){
		// 			console.warn('suckieses');
		// 		}

		// 		let text = await this.app.vault.read(currentFile);
		// 		const textEnd = frontmatter?.position?.end?.offset;
		// 		let body = text.slice(textEnd)
		// 		let openTagText = '<cm';
		// 		let closeTagText = 'cm>';

		// 		this.app.vault.process(currentFile, (data:string):string => {
		// 			let body = data;
		// 			let openTag = body.indexOf(openTagText);
		// 			let closeTag = body.indexOf(closeTagText, openTag); // We want the closing tag to be after the opening tag, not just anywhere in general
		// 			while (openTag != -1 && closeTag != -1) {
		// 				if(this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() == 'preview')
		// 				{
		// 					body = body.slice(0, openTag) + ' [PUT CALENDAR HERE] ' + body.slice(closeTag + closeTagText.length)
		// 				} else {
		// 					body = body.slice(0, openTag + openTagText.length) + ' [PUT CALENDAR HERE] ' + body.slice(closeTag)
		// 				}
		// 				openTag = body.indexOf(openTagText, closeTag);
		// 				closeTag = body.indexOf(closeTagText, openTag);
		// 			}
		// 			if(this.app.workspace.getActiveViewOfType(MarkdownView)?.data){
		// 				this.app.workspace.getActiveViewOfType(MarkdownView)?.setViewData(body, false);
		// 			}
		// 			return data;
		// 		});
		// 		console.log(this.app.workspace.getActiveViewOfType(MarkdownView));
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new CalendarManagerSettingsTab(this.app, this));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	findYamlSections(sections:Array<SectionCache>):Array<SectionCache> {
		const yamlSections: Array<SectionCache> = new Array<SectionCache>;
		for (let section of sections) {
			if (section.type == 'yaml') {
				yamlSections.push(section);
			}
		}
		return yamlSections;
	}

	async activateView() {
		if (this.app.workspace.getLeavesOfType(CALENDAR_VIEW_TYPE).length === 0) {
			await this.app.workspace.getRightLeaf(false).setViewState({
				type: CALENDAR_VIEW_TYPE,
				active: true,
			})
		}

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(CALENDAR_VIEW_TYPE)[0]
		)
	}
}

class CalendarManagerSettingsTab extends PluginSettingTab {
	plugin: CalendarManager;

	constructor(app: App, plugin: CalendarManager) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
