'use strict'
const Log = use('App/Models/Log');
const {
  validateAll,
} = use('Validator');

const uuid = require('uuid/v4');
const osName = require('os-name');

class LogController {
  async create({
    request,
    response
  }) {
    // Validate user input
    const validation = await validateAll(request.all(), {
      log: 'required|json',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Invalid POST arguments',
        messages: validation.messages(),
        status: 401,
      });
    }

    // Validate log file
    const log = JSON.parse(request.input('log'));
    const logValidation = await validateAll(log, {
      host: 'required|object',
      'host.platform': 'required|string',
      'host.release': 'required|string',
      'host.screens': 'required|array',
      ferdi: 'required|object',
      'ferdi.version': 'required|string',
      'ferdi.electron': 'required|string',
      'ferdi.installedRecipes': 'required|array',
      'ferdi.devRecipes': 'required|array',
      'ferdi.services': 'required|array',
      'ferdi.errors': 'required|array',
      'ferdi.workspaces': 'required|array',
      'ferdi.windowSettings': 'required|object',
      'ferdi.windowSettings.width': 'required|integer',
      'ferdi.windowSettings.height': 'required|integer',
      'ferdi.windowSettings.y': 'required|integer',
      'ferdi.windowSettings.x': 'required|integer',
      'ferdi.windowSettings.isMaximized': 'required|boolean',
      'ferdi.windowSettings.isFullScreen': 'required|boolean',
      'ferdi.settings': 'required|object',
      'ferdi.settings.autoLaunchInBackground': 'required|boolean',
      'ferdi.settings.runInBackground': 'required|boolean',
      'ferdi.settings.spellcheckerLanguage': 'required|string',
      'ferdi.settings.locale': 'required|string',
      'ferdi.settings.darkMode': 'required|boolean',
      'ferdi.settings.universalDarkMode': 'required|boolean',
      'ferdi.settings.beta': 'required|boolean',
      'ferdi.settings.server': 'required|string',
      'ferdi.settings.hibernate': 'required|boolean',
      'ferdi.features': 'required|object',
    });
    if (logValidation.fails()) {
      return response.status(401).send({
        message: 'Invalid log file',
        messages: logValidation.messages(),
        status: 401,
      });
    }

    // Find logId for new log
    let id;
    do {
      id = uuid();
    } while((await Log.query().where('logId', id).fetch()).rows.length > 0)

    await Log.create({
      logId: id,
      log: request.input('log')
    });

    return response.send({
      status: 'success',
      id: id,
    })
  }

  async view({
    params,
    view
  }) {
    if (!params.id) {
      return view.render('404');
    }

    const log = await Log.find(params.id);

    if (!log) {
      return view.render('404');
    }

    const logInfo = JSON.parse(log.log);

    // Replace Service IDs with recipe names in workspace list
    for(const workspace in logInfo.ferdi.workspaces) {
      for (const service in logInfo.ferdi.workspaces[workspace].services) {
        const s = logInfo.ferdi.workspaces[workspace].services[service];
        const serviceInfo = logInfo.ferdi.services.find(el => el.id === s);
        logInfo.ferdi.workspaces[workspace].services[service] = serviceInfo ? serviceInfo.recipe : undefined;
      }
    }

    const created = new Date(log.created_at).toLocaleDateString();
    
    return view.render('log', {
      log: logInfo,
      os: osName(logInfo.host.platform, logInfo.host.release),
      entry: log,
      created,

      // We don't have access to some JavaScript functions in the view by default
      // Pass needed functions to view
      json: JSON.stringify,
      keys: Object.keys,
      boolean: Boolean,
    });
  }
}

module.exports = LogController
