import Start from 'start';
import reporter from 'start-pretty-reporter';
import env from 'start-env';
import files from 'start-files';
import watch from 'start-watch';
import clean from 'start-clean';
import read from 'start-read';
import babel from 'start-babel';
import write from 'start-write';
import eslint from 'start-eslint';
import tape from 'start-tape';
import * as istanbul from 'start-istanbul';
import codecov from 'start-codecov';

import babelIstanbul from 'babel-istanbul';
import tapSpec from 'tap-spec';

const start = Start(reporter());

export function build() {
    return start(
        env('production'),
        files('build/'),
        clean(),
        files('lib/**/*.js'),
        read(),
        babel(),
        write('build/')
    );
}

export function dev() {
    return start(
        env('development'),
        files('build/'),
        clean(),
        files('lib/**/*.js'),
        watch(file => start(
            files(file),
            read(),
            babel(),
            write('build/')
        ))
    );
}

export function lint() {
    return start(
        env('test'),
        files([ 'lib/**/*.js', 'test/**/*.js' ]),
        eslint()
    );
}

export function test() {
    return start(
        env('test'),
        files('test/**/*.js'),
        tape(tapSpec)
    );
}

export function tdd() {
    return start(
        files([ 'lib/**/*.js', 'test/**/*.js' ]),
        watch(test)
    );
}

export function coverage() {
    return start(
        env('test'),
        files('coverage/'),
        clean(),
        files('lib/**/*.js'),
        istanbul.instrument(babelIstanbul),
        test,
        istanbul.report([ 'lcovonly', 'html', 'text-summary' ])
    );
}

export function ci() {
    return start(
        lint,
        coverage,
        files('coverage/lcov.info'),
        read(),
        codecov()
    );
}

export function prepush() {
    return start(
        lint,
        coverage
    );
}
