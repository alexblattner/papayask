let clients = [];

exports.eventsHandler = (req, res, next) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  res.writeHead(200, headers);

  const data = `data: connection opened\n\n`;

  res.write(data);
  const userId = req.params.id;
  const newClient = {
    id: userId,
    res,
  };
  console.log('new client connected - ' + userId);
  clients.push(newClient);

  req.on('close', () => {
    console.log(`${userId} Connection closed`);
    clients = clients.filter((client) => client.id !== userId);
  });
};

exports.sendEventToClient = (clientId, data) => {
  const client = clients.find((client) => client.id === clientId.toString());
  if (client) {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};
