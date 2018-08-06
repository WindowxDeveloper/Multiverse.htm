'use strict';

function logic(){
    /*
    if(webgl_characters[webgl_character_id]['health-current'] > 0){
        if(core_keys[core_storage_data['shoot']]['state']){
            webgl_particles_create({
              'gravity': false,
              'translate-x': webgl_characters[webgl_character_id]['translate-x'],
              'translate-y': webgl_characters[webgl_character_id]['translate-y'],
              'translate-z': webgl_characters[webgl_character_id]['translate-z'],
            });
        }
    }
    */

    core_ui_update({
      'ids': {
        'health-current': webgl_characters[webgl_character_id]['health-current'],
        'health-max': webgl_characters[webgl_character_id]['health-max'],
      },
    });
}

function repo_escape(){
    if(webgl_character_level() > -2){
        let inventory = '';
        for(let item in webgl_characters[webgl_character_id]['inventory']){
            inventory += '<li>' + item + ': ' + webgl_characters[webgl_character_id]['inventory'][item];
        }
        core_ui_update({
          'ids': {
            'experience': webgl_characters[webgl_character_id]['experience'],
            'inventory': inventory,
            'jump-height': webgl_characters[webgl_character_id]['jump-height'],
            'level': webgl_characters[webgl_character_id]['level'],
            'speed': webgl_characters[webgl_character_id]['speed'],
          },
        });
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(webgl_character_level() > -2
              && core_storage_data['beforeunload-warning']){
                return 'Exit?';
            }
        },
      },
      'events': {
        'load_character': {
          'onclick': function(){
              if(webgl_character_level() < 0
                || window.confirm('Load new character?')){
                  webgl_load_level({
                    'character': 1,
                    'json': document.getElementById('character_json').files[0] || false,
                  });
              }
          },
        },
        'load_level': {
          'onclick': function(){
              webgl_load_level({
                'character': 0,
                'json': document.getElementById('level_json').files[0] || false,
              });
          },
        },
        'load_prebuilt': {
          'onclick': function(){
              ajax_level(document.getElementById('level_select').value);
          },
        },
      },
      'info': '<table><tr><td>Level: <span id=ui-level></span> (<span id=ui-experience></span>)'
        + '<td rowspan=2>Inventory: <ul id=ui-inventory></ul>'
        + '<tr><td>Jump Height: <span id=ui-jump-height></span><br>'
        + 'Speed: <span id=ui-speed></span></table>'
        + '<hr><table><tr><td><input id=character_json type=file><td><input id=load_character type=button value="Load Character From File">'
        + '<tr><td><input id=level_json type=file><td><input id=load_level type=button value="Load Level From File">'
        + '<tr><td><select id=level_select></select><td><input id=load_prebuilt type=button value="Load Prebuilt Level"></table>',
      'keybinds': {
        32: {},
        67: {},
        70: {},
      },
      'menu': true,
      'mousebinds': {
        'contextmenu': {
          'preventDefault': true,
        },
        'mousemove': {
          'preventDefault': true,
          'todo': webgl_camera_handle,
        },
        'mousewheel': {
          'todo': webgl_camera_zoom,
        },
      },
      'storage': {
        'beforeunload-warning': true,
        'shoot': 70,
      },
      'storage-menu': '<table><tr><td><input id=beforeunload-warning type=checkbox><td>beforeunload Warning<tr><td><input id=shoot><td>Shoot</table>',
      'title': 'Multiverse.htm',
      'ui': 'Health: <span id=ui-health-current></span>/<span id=ui-health-max></span><br>',
    });

    // Populate prebuilt level select if multiverselevels defined.
    if('multiverselevels' in window){
        let level_select = '';
        for(let level in multiverselevels){
            level_select += '<option value="' + level + '">' + multiverselevels[level] + '</option>';
        }
        document.getElementById('level_select').innerHTML = level_select;
    }

    // Create character export tab.
    core_tab_create({
      'content': '<input id=update_json type=button value="Update Character JSON"><br><textarea id=exported></textarea>',
      'group': 'core-menu',
      'id': 'export',
      'label': 'Export Character',
    });
    core_events_bind({
      'elements': {
        'update_json': {
          'onclick': function(){
              webgl_json_export();
          },
        },
      },
    });
}
