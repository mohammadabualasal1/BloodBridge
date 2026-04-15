using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BloodBridge.Model;
using BloodBridge.DTOs;
using BloodBridge.DTOs.AuthDtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BloodBridge.DTOs.BloodRequestDTOS;
namespace BloodBridge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodRequestsController : ControllerBase
    {
        private BloodBridgeDbContext _dbContext;
        public BloodRequestsController(BloodBridgeDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("CreateRequest")]
        [Authorize(Roles = "Hospital")]
        public async Task<IActionResult> CreateRequest([FromBody] BloodRequestDto dto)
        {
            var userIdString=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);
            var hospital = _dbContext.Hospitals.FirstOrDefault(h => h.UserId == userId);
            if (hospital == null)
            { return BadRequest(); }
            if(!hospital.IsVerified)
            {
                return BadRequest(new { message = "Hospital is not verified yet" });
            }
            var bloodRequest = new BloodRequests
            {

                    BloodType = dto.BloodType,
                    Quantity = (long)dto.Quantity,
                    Urgency = dto.Urgency,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    HospitalId = hospital.Id
                };
                _dbContext.BloodRequests.Add(bloodRequest);
                await _dbContext.SaveChangesAsync();
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == hospital.UserId);
                foreach (var donor in _dbContext.Donors.Where(d => d.BloodType == dto.BloodType && d.IsAvailable))
                {
                    var notification = new Notifications
                    {
                        UserId = donor.UserId,
                        Message = $"New blood request for {dto.BloodType} blood type with quantity {dto.Quantity} and urgency {dto.Urgency} has been created.",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false

                    };
                    _dbContext.Notifications.Add(notification);

                }
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Blood request created successfully" });


        }
        [HttpGet("bloodrequests")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> bloodrequests()
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userId = int.Parse(userIdString);
                var donor = await _dbContext.Donors.FirstOrDefaultAsync(d => d.UserId == userId);
                if (donor == null) return NotFound();
                var requests = from r in _dbContext.BloodRequests
                               join h in _dbContext.Hospitals on r.HospitalId equals h.Id
                               join u in _dbContext.Users on h.UserId equals u.Id
                               where r.Status == "Pending" && h.IsVerified && donor.BloodType == r.BloodType
                               select new
                               {
                                   r.Id,
                                   r.BloodType,
                                   r.Quantity,
                                   r.Urgency,
                                   r.CreatedAt,
                                   HospitalName = h.HospitalName,
                                   HospitalCity = h.City,
                                   HospitalAddress = h.Address,
                                   ContactEmail = u.Email,
                                   ContactPhone = u.Phone
                               };
                return Ok(await requests.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
        [HttpGet("MyRequests")]
        [Authorize(Roles = "Hospital")]
        public async Task<IActionResult> MyRequests()
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userId = int.Parse(userIdString);
                var hospital = _dbContext.Hospitals.FirstOrDefault(h => h.UserId == userId);
                if (hospital == null) { return BadRequest(); }
                var requests = await _dbContext.BloodRequests.Where(r => r.HospitalId == hospital.Id)
                    .Select(r => new
                    {
                        r.Id,
                        r.BloodType,
                        r.Quantity,
                        r.Urgency,
                        r.Status,
                        r.CreatedAt
                    }).ToListAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }


        [HttpPut("cancelRequest/{Id}")]
        [Authorize(Roles = "Hospital")]
        public async Task<IActionResult> CancelRequest(long Id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var UserId = int.Parse(userIdString);
                var hospital = _dbContext.Hospitals.FirstOrDefault(h => h.UserId == UserId);
                if (hospital == null) { return BadRequest(); }
                var bloodrequest = _dbContext.BloodRequests.FirstOrDefault(b => b.Id == Id);
                if (bloodrequests == null) { return NotFound(); }
                if (bloodrequest.HospitalId != hospital.Id) { return Unauthorized(); }
                bloodrequest.Status = "Cancelled";
                await _dbContext.SaveChangesAsync();
                return Ok(new { massage = "Request cancelled successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }















        }
}

