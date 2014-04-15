type FsMock := {
    fs: {
        writeFile: (String, String, Callback) => void,
        mkdir: (String, Callback) => void,
        unlink: (String, Callback) => void
    },
    mkdirp: (String, Callback) => void,
    rimraf: (String, Callback) => void
}

type Fixture := Object<String, String | Fixture>

type Task<T> := Callback<Error, T> | Object & {
    end: Callback<Error, T>
}

fixtures-fs/create-fixtures := (
    dirname: String,
    fixtures: Fixture,
    opts?: FsMock,
    callback: Callback<Error>
) => void

fixtures-fs/teardown-fixtures := (
    dirname: String,
    fixtures: Fixture,
    opts?: FsMock,
    callback: Callback<Error>
) => void

fixtures-fs :=
    (
        dirname: String,
        fixtures: Fixture, 
        lambda: (Task<T>) => void,
        opts?: FsMock,
        task: Task<T>
    ) => void &
    (
        dirname: String,
        fixtures: Fixture, 
        lambda: (Task<T>) => void,
        opts?: FsMock
    ) => (Task<T>) => void
    
