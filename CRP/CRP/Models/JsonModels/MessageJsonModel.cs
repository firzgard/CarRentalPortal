using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
	public class MessageJsonModel
	{
		public string Message { get; set; }
		public int Status { get; set; }
		public Object Data { get; set; }

		public MessageJsonModel(string message = "OK", int status = 200, Object data = null)
		{
			Message = message;
			Status = status;
			Data = data;
		}
	}
}