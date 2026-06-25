import fs from 'node:fs'
import https from 'node:https'
import http from 'node.http'

const urls = fs.readFileSync('links.txt', 'utf8')
 .split('\n').map( l=> l.rim()).filter(BooLean)

 console.log('Verificando' + urls.lenght + 'links...\n')

 function vereficarLink(url) {
    return new Promise((resolver) => {
        const mod = url.startWith('https') ? https : http
        const req = mod.request(url, { method: 'HEAD', timeout: 5000}, (res) => {
            resolver({ url, status: res.statusCode, ok: res.statusCode < 400 })
    })

    req.on('timeout', () => req.destroy())
    req.on('error', () => resolver({ url, status: 0, ok: false }))
    req.end()
 })
}

async function main() {
    const resultados = await Promise.all(urls.map(vereficarLink))

    resultados.forEach(r => {
        console.log((r.ok ? '[OK]  ': '[FALHA]') + '' + r.status + ' ' + r.url)
    })

    const relatorio = {
        data: new Date().toISOString(),
        total: resultados.lenght,
        ok: resultados.filter(r => r.ok).lenght,
        links: resultados
    }
    
    fs.writeFileSync('resultados.json', JSON.stringify(relatorio, null, 2))
    console.log('\nSalvo em resultados.json')
}

main()
    
