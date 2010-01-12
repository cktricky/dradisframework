// From: http://extjs.com/learn/Tutorial:Extending_Ext2_Class

Ext.ns('dradis.notes');

/********************************************************************* Panel */
dradis.notes.NoteEditorPanel=Ext.extend(Ext.Panel, {
  //props (overridable by caller)
  fields: {},

  initComponent: function(){
    // Called during component initialization
    var config ={
      //props (non-overridable)
      layout: 'border',
      border: false,
      items:[
        this.fields.editor = new Ext.form.TextArea({
          region: 'north',
          height: 240,
          split: true,
          autoScroll: true,
          border: true,
          enableKeyEvents: true
        }),
        this.fields.preview = new dradis.notes.NotePreviewPanel()
      ],
      buttons:[
        {
          text:'Save',
          scope:this,
          handler:function() { this.fireEvent('save', this.fields.editor.getValue()); }
        },
        {
          text:'Cancel',
          scope: this,
          handler: function(){ this.clear(); this.fireEvent('cancel'); }
        }
      ]

    };

    // Config object has already been applied to 'this' so properties can 
    // be overriden here or new properties (e.g. items, tools, buttons) 
    // can be added, eg:
    Ext.apply(this, config);
    Ext.apply(this.initialConfig, config); 
        
    // Before parent code
 
    // Call parent (required)
    dradis.notes.NoteEditorPanel.superclass.initComponent.apply(this, arguments);

    this.addEvents('save', 'cancel');

    // After parent code
    // e.g. install event handlers on rendered component
    this.fields.editor.on( 'keypress', function(field, evt){
      this.fields.preview.update(field.getValue());
    }, this, {buffer: 500});
  },

  // other methods/actions
  load: function(record){
    this.fields.editor.setValue( record.get('text') );
    this.fields.preview.update( record.get('text') );
  },

  clear: function(){
    this.fields.editor.setValue('');
    this.fields.preview.clear();
  }
});

/******************************************************************** Window */
dradis.notes.NoteEditorWindow=Ext.extend(Ext.Window, {
  //props (overridable by caller)
  title:'Note Editor',
  width: 640,
  height: 480,
  modal: true,
  maximizable: true,
  closeAction: 'hide',
  fields: {},

  initComponent: function(){
    // Called during component initialization
    var config ={
      //props (non-overridable)
      layout: 'fit',
      minWidth: 300,
      minHeight: 150,
      items: [ 
        this.fields.panel = new dradis.notes.NoteEditorPanel()
      ]
    };

    // Config object has already been applied to 'this' so properties can 
    // be overriden here or new properties (e.g. items, tools, buttons) 
    // can be added, eg:
    Ext.apply(this, config);
    Ext.apply(this.initialConfig, config); 
        
    // Before parent code
 
    // Call parent (required)
    dradis.notes.NoteEditorWindow.superclass.initComponent.apply(this, arguments);

    // After parent code
    // e.g. install event handlers on rendered component
    this.relayEvents(this.fields.panel, ['cancel', 'save']);

    this.fields.panel.on('cancel', function(){ this.hide(); }, this );

    this.fields.panel.on('save', function(){ this.hide(); }, this );
  },

  // other methods/actions
  load: function(record){
    this.fields.panel.load(record);
  },

  clear: function(){ this.fields.panel.clear(); }
});


Ext.reg('noteeditor', dradis.notes.NoteEditorWindow); 