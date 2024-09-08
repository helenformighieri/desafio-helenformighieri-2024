class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[animal];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            if (!animalInfo.biomas.includes(recinto.bioma) && !(animalInfo.biomas.includes('savana') && recinto.bioma === 'savana e rio')) {
                continue;
            }

            let espacoOcupado = recinto.animais.reduce((acc, a) => acc + this.animais[a.especie].tamanho * a.quantidade, 0);
            let espacoNecessario = animalInfo.tamanho * quantidade;

            if (recinto.animais.length > 0 && !animalInfo.carnivoro && !recinto.animais.some(a => this.animais[a.especie].carnivoro)) {
                espacoNecessario += 1;
            }

            if (animalInfo.carnivoro && recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) {
                continue;
            }

            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) {
                continue;
            }

            if (animal === 'MACACO' && quantidade === 1 && recinto.animais.length === 0) {
                continue;
            }

            if (recinto.animais.some(a => !this.animais[a.especie].biomas.includes(recinto.bioma) || (this.animais[a.especie].carnivoro && a.especie !== animal))) {
                continue;
            }

            if (espacoOcupado + espacoNecessario <= recinto.tamanhoTotal) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.tamanhoTotal - espacoOcupado - espacoNecessario} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        recintosViaveis.sort((a, b) => {
            const numeroA = parseInt(a.match(/Recinto (\d+)/)[1]);
            const numeroB = parseInt(b.match(/Recinto (\d+)/)[1]);
            return numeroA - numeroB;
        });

        return { recintosViaveis };
    }
}

export { RecintosZoo };