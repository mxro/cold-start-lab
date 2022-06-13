package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/gin-gonic/gin"
)

type dynamoDBResponse struct {
	Message string
}

func DynamoDBHandler(c *gin.Context) {
	mySession := session.Must(session.NewSession())
	client := dynamodb.New(mySession)
	var tablename string = "cold-start-lab"
	client.Query(&dynamodb.QueryInput{
		
	})
	result, err := client.GetItem(&dynamodb.GetItemInput{
		TableName: &tablename,
		Key: map[string]*dynamodb.AttributeValue{
			"pk": {
				S: aws.String("dummy-user@dummy.com"),
			},
			"sk": {
				S: aws.String("Dummy User"),
			},
		},
		// TableName: aws.String(tableName),
		// Key: map[string]*dynamodb.AttributeValue{
		// 	"Year": {
		// 		N: aws.String(movieYear),
		// 	},
		// 	"Title": {
		// 		S: aws.String(movieName),
		// 	},
		// },
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	res := dynamoDBResponse{fmt.Sprintf("Hello, %v", result)}

	json_data, err := json.Marshal(res)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.String(http.StatusOK, string(json_data))
}
