import matplotlib.mlab as mlab
import matplotlib.pyplot as plt
import json

data = ['dkos']
for name in data:
    scores = json.load(open(name + '.json', 'r'))
    for score in scores:
        
    # plt.hist(scores, 50, normed=1, facecolor='green', alpha=0.75)
    # plt.xlabel('Probability of being Liberal')
    # plt.ylabel('Frequency')
    # plt.title('Distribution for ' + name)
    # plt.axis([0, 1, 0, 4])
    # plt.grid(True)
    #
    # plt.show()
    # plt.savefig(name + '.png')
