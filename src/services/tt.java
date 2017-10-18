package com.passbox.sgt.passboxtest.util;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

/**
 * Created by jinho on 2017-08-31.
 */

public class PassBox_SQLite_Loader {
    private static PassBox_SQLite_Loader pbslIntance;

    private static final String dbName = "PassBoxApplication.db";
    private static final int dbVersion = 1;
    private static final String tag = "SQLite";

    private PassBox_SQLiteOpenHelper pbHelper;
    private SQLiteDatabase db;

    private PassBox_SQLite_Loader() {}

    private PassBox_SQLite_Loader(context) {
        pbHelper = new PassBox_SQLiteOpenHelper(
                context,
                dbName,
                null,
                dbVersion
        );
        try {
            db = pbHelper.getWritableDatabase();
        } catch (SQLiteException e) {
            e.printStackTrace();
            Log.e(tag, "데이터를 얻어올 수 없음");
        }
    }

    private static PassBox_SQLite_Loader PassBox_SQLite_Loader(Context context) {
        if (pbslIntance == null) pbslIntance = new PassBox_SQLite_Loader(context);

        return pbslIntance;
    }

    public SQLiteDatabase getDB(){
        return db;
    }

    public insert(~~){
        ~~~
    }

    public select(~~){
        ~~~
    }


}

