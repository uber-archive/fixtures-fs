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

type EndCallback<T> := Callback<Error, T> | Object & {
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
        lambda: (EndCallback<T>) => void,
        opts?: FsMock,
        task: EndCallback<T>
    ) => void &
    (
        dirname: String,
        fixtures: Fixture, 
        lambda: (EndCallback<T>) => void,
        opts?: FsMock
    ) => (EndCallback<T>) => void
    
