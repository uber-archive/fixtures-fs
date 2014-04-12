

create-fixtures := (
    dirname: String,
    fixtures: Object<String, String | Object>,
    callback: Callback<Error>
) => void

teardown-fixtures := (
    dirname: String,
    fixtures: Object<String, String | Object>,
    callback: Callback<Error>
) => void
