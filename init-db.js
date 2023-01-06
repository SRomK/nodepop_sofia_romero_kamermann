

// Inicializar la base datos con los datos mínimos para funcionar

const readline = require('readline');

// cargamos los modelos
const Agente = require('./models/Agente');

async function main() {

  // preguntar al usuario si está seguro
  const continuar = await preguntaSiNo('Estas seguro, seguro, seguro, que quieres borrar la base de datos? [n]')
  if (!continuar) {
    process.exit();
  }

  // conectar a la base de datos
  const connection = require('./lib/connectMongoose')

  // inicializar la colección de agentes
  await initAgentes();

  // desconectamos de la base de datos
  connection.close();
}

main().catch(err => console.log('Hubo un error', err));

async function initAgentes() {
  // borrar todos los documentos de la colección de agentes
  const result = await Agente.deleteMany();
  console.log(`Eliminados ${result.deletedCount} agentes.`);

  // crear agentes iniciales
  const inserted = await Agente.insertMany([
    { name: 'Smith', age: 30 },
    { name: 'Jones', age: 35 },
    { name: 'Brown', age: 19 },
  ]);
  console.log(`Creados ${inserted.length} agentes.`)
}

function preguntaSiNo(texto) {
  return new Promise((resolve, reject) => {
    const interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interface.question(texto, respuesta => {
      interface.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    })
  })
}