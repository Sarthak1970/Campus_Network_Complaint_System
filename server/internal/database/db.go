package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB(dbURL string){
	var err error
	DB,err=pgxpool.New(context.Background(),dbURL)
	if err!=nil{
		fmt.Printf("Unable to connect to database : %v\n",err)
	}
	fmt.Println("Connected to DB Successfully")
}

