package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type helloResponse struct {
	Message string
}

func HelloHandler(c *gin.Context) {
	res := helloResponse{"Hello from your number 1 student :D"}
	json_data, err := json.Marshal(res)
	fmt.Println("This is it: ", json_data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	c.String(http.StatusOK, string(json_data))
}
