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
      ferdium: 'required|object',
      'ferdium.version': 'required|string',
      'ferdium.electron': 'required|string',
      'ferdium.installedRecipes': 'array',
      'ferdium.devRecipes': 'array',
      'ferdium.services': 'array',
      'ferdium.messages': 'array',
      'ferdium.workspaces': 'array',
      'ferdium.windowSettings': 'required|object',
      'ferdium.windowSettings.width': 'required|integer',
      'ferdium.windowSettings.height': 'required|integer',
      'ferdium.windowSettings.y': 'required|integer',
      'ferdium.windowSettings.x': 'required|integer',
      'ferdium.windowSettings.isMaximized': 'required|boolean',
      'ferdium.windowSettings.isFullScreen': 'required|boolean',
      'ferdium.settings': 'required|object',
      'ferdium.settings.autoLaunchInBackground': 'required|boolean',
      'ferdium.settings.runInBackground': 'required|boolean',
      'ferdium.settings.spellcheckerLanguage': 'required|string',
      'ferdium.settings.locale': 'required|string',
      'ferdium.settings.darkMode': 'required|boolean',
      'ferdium.settings.universalDarkMode': 'required|boolean',
      'ferdium.settings.beta': 'required|boolean',
      'ferdium.settings.server': 'required|string',
      'ferdium.settings.hibernate': 'required|boolean',
      // 'ferdium.features': 'required|object',
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
    for(const workspace in logInfo.ferdium.workspaces) {
      for (const service in logInfo.ferdium.workspaces[workspace].services) {
        const s = logInfo.ferdium.workspaces[workspace].services[service];
        const serviceInfo = logInfo.ferdium.services.find(el => el.id === s);
        logInfo.ferdium.workspaces[workspace].services[service] = serviceInfo ? serviceInfo.recipe : undefined;
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
