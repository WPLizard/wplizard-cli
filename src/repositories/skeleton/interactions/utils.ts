import { Presets, SingleBar } from "cli-progress"

const showProgress = (total: number, callback: (bar: SingleBar) => void,  current: number = 0) => {
    const bar = new SingleBar({
        barCompleteString: '\u2588',
        barGlue: '|',
        stopOnComplete: true,
    }, Presets.shades_classic)

    bar.start(total, current);
    callback(bar);
}

export { showProgress }